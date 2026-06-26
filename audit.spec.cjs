const { chromium } = require("playwright");

const AUTH_STATE = {
  origins: [{
    origin: "http://localhost:5173",
    localStorage: [
      { name: "user", value: JSON.stringify({ email: "test@dronetv.in", userData: { email: "test@dronetv.in", name: "Test User" } }) },
      { name: "token", value: "mock_token_test" },
      { name: "addons_active_test@dronetv.in", value: JSON.stringify(["featured_placement"]) },
      { name: "user_posts_test@dronetv.in", value: JSON.stringify([
        { id: "p1", type: "promo_post", title: "Launch Announcement", content: "We are thrilled to announce our new drone product line!", status: "submitted", featured: true, createdAt: new Date().toISOString() },
        { id: "p2", type: "article", title: "Editorial Article Draft", content: "Industry analysis on drone regulations in 2026", status: "in_review", featured: false, createdAt: new Date().toISOString() },
        { id: "p3", type: "promo_post", title: "Published Promo", content: "Check out our certified Type-2 drones now on DroneTv!", status: "published", featured: false, createdAt: new Date().toISOString() },
      ]) },
    ]
  }]
};

async function screenshot(page, name, extra) {
  await page.screenshot({ path: `/tmp/audit_${name}.png`, fullPage: true, ...extra });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    storageState: AUTH_STATE,
    viewport: { width: 1440, height: 900 },
  });
  const ctxMob = await browser.newContext({
    storageState: AUTH_STATE,
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });

  const page = await ctx.newPage();
  const mob = await ctxMob.newPage();

  // intercept profile API for all pages
  for (const p of [page, mob]) {
    await p.route("**/Prod/profile**", route => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ profile: { tokenBalance: 2500, name: "Test User" } }),
    }));
    await p.route("**/spend-tokens**", route => route.fulfill({ status: 200, body: '{"ok":true}' }));
  }

  const routes = [
    ["user_dashboard",   "/user-dashboard"],
    ["user_companies",   "/user-companies"],
    ["user_professionals", "/user-professionals"],
    ["user_events",      "/user-events"],
    ["user_posts",       "/user-posts"],
    ["user_addons",      "/user-addons"],
    ["user_media_hub",   "/user-media-hub"],
    ["user_leads",       "/user-leads"],
    ["user_website",     "/user-website"],
    ["user_recharge",    "/user-recharge"],
    ["user_transactions","/user-transactions"],
    ["user_contacted",   "/user-contacted"],
  ];

  for (const [name, path] of routes) {
    await page.goto(`http://localhost:5173${path}`);
    await page.waitForTimeout(1500);
    await screenshot(page, `desk_${name}`);

    await mob.goto(`http://localhost:5173${path}`);
    await mob.waitForTimeout(1500);
    await screenshot(mob, `mob_${name}`);
  }

  // posts page: open the new form
  await page.goto("http://localhost:5173/user-posts");
  await page.waitForTimeout(1000);
  await page.click("button:has-text('Submit New')").catch(() => {});
  await page.waitForTimeout(600);
  await screenshot(page, "desk_user_posts_form");

  await mob.goto("http://localhost:5173/user-posts");
  await mob.waitForTimeout(1000);
  await mob.click("button:has-text('Submit New')").catch(() => {});
  await mob.waitForTimeout(600);
  await screenshot(mob, "mob_user_posts_form");

  // addons: click active tab
  await page.goto("http://localhost:5173/user-addons");
  await page.waitForTimeout(1500);
  await page.click("button:has-text('Active')").catch(() => {});
  await page.waitForTimeout(600);
  await screenshot(page, "desk_addons_active");

  await mob.goto("http://localhost:5173/user-addons");
  await mob.waitForTimeout(1500);
  await mob.click("button:has-text('Active')").catch(() => {});
  await mob.waitForTimeout(600);
  await screenshot(mob, "mob_addons_active");

  // sidebar collapsed state (desktop)
  await page.goto("http://localhost:5173/user-posts");
  await page.waitForTimeout(1000);
  // find sidebar toggle button
  await page.click("button[aria-label='Toggle sidebar'], button.sidebar-toggle, nav button:first-child").catch(() => {});
  await page.waitForTimeout(600);
  await screenshot(page, "desk_sidebar_collapsed");

  await browser.close();
  console.log("Done");
})();
