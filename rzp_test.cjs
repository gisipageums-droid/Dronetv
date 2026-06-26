const { chromium } = require("playwright");

const AUTH_STATE = {
  origins: [{
    origin: "http://localhost:5173",
    localStorage: [
      { name: "user", value: JSON.stringify({ email: "test@dronetv.in", userData: { email: "test@dronetv.in", name: "Test User", fullName: "Test User" } }) },
      { name: "token", value: "mock_token_test" },
    ]
  }]
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ storageState: AUTH_STATE, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.route("**/Prod/profile**", route => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ profile: { tokenBalance: 2500, name: "Test User" } }),
  }));

  // Simulate Lambda returning LIVE key — our frontend should OVERRIDE with test key
  await page.route("**/place-order**", async route => {
    await route.fulfill({
      status: 200, contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          transactionId: "txn_test_123",
          razorpayOrderId: "order_test_123",
          key: "rzp_live_Sm0GPcZ5M8emd8",
          order: { amount: 500000, currency: "INR" }
        }
      })
    });
  });

  // Intercept Razorpay script load and spy on constructor
  await page.addInitScript(() => {
    window.__razorpay_key_used = null;
    const _orig = window.Razorpay;
    Object.defineProperty(window, 'Razorpay', {
      configurable: true,
      set(val) {
        const Wrapped = function(opts) {
          window.__razorpay_key_used = opts.key;
          return { open() {}, on() {} };
        };
        Object.defineProperty(window, 'Razorpay', { value: Wrapped, writable: true, configurable: true });
      },
      get() { return window._rzp_wrapped; }
    });
  });

  page.on('console', msg => {
    if (msg.text().includes('rzp') || msg.text().includes('Razorpay') || msg.text().includes('key')) {
      console.log('CONSOLE:', msg.text());
    }
  });

  await page.goto("http://localhost:5173/user-recharge");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "/tmp/rzp_1_recharge.png", fullPage: true });

  // Check the env var injected into the bundle
  const envKey = await page.evaluate(() => {
    // Vite injects import.meta.env as a static replacement
    // We can check if rzp_test key appears in any loaded script
    return null;
  });

  // Click Select Plan button
  const btn = await page.locator("button:visible").filter({ hasText: /select plan/i }).first();
  if (await btn.count() > 0) {
    await btn.click();
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: "/tmp/rzp_2_after_click.png", fullPage: true });

  const keyUsed = await page.evaluate(() => window.__razorpay_key_used);
  console.log("=== RAZORPAY KEY TEST ===");
  console.log("Lambda would return:   rzp_live_Sm0GPcZ5M8emd8");
  console.log("Key actually used:    ", keyUsed || "(Razorpay not opened yet)");
  console.log("Expected (dev/test):   rzp_test_Sjh48B3pi7l9QN");

  await browser.close();
})();
