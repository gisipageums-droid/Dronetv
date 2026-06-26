const { chromium } = require("playwright");

const ADMIN_STATE = {
  origins: [{
    origin: "http://localhost:5173",
    localStorage: [
      { name: "admin", value: JSON.stringify({ email: "dev@dronetv.in", token: "admin_mock_token", role: "admin" }) },
      { name: "adminToken", value: "admin_mock_token" },
    ]
  }]
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ storageState: ADMIN_STATE, viewport: { width: 1440, height: 900 } });
  const a = await ctx.newPage();

  const pages = [
    ["a_company_dash",  "/admin/company/dashboard"],
    ["a_users",         "/admin/users"],
    ["a_plans",         "/admin/plans"],
    ["a_professionals", "/admin/professional/dashboard"],
    ["a_events",        "/admin/event/dashboard"],
    ["a_media",         "/admin/media/dashboard"],
    ["a_invoices",      "/admin/invoices"],
    ["a_settings",      "/admin/settings"],
  ];

  for (const [name, path] of pages) {
    await a.goto(`http://localhost:5173${path}`);
    await a.waitForTimeout(2000);
    await a.screenshot({ path: `/tmp/adm_${name}.png`, fullPage: false });
    console.log("✓", name);
  }
  await browser.close();
  console.log("Admin screenshots done");
})();
