const { chromium } = require("playwright");

const USER_STATE = {
  origins: [{
    origin: "http://localhost:5173",
    localStorage: [
      { name: "user", value: JSON.stringify({ email: "test@dronetv.in", userData: { email: "test@dronetv.in", name: "Test User", fullName: "Test User" } }) },
      { name: "token", value: "mock_token_test" },
    ]
  }]
};

const ADMIN_STATE = {
  origins: [{
    origin: "http://localhost:5173",
    localStorage: [
      { name: "adminAuth", value: JSON.stringify({ token: "admin_mock_token", email: "dev@dronetv.in", role: "admin" }) },
      { name: "adminToken", value: "admin_mock_token" },
    ]
  }]
};

async function ss(page, name) {
  await page.screenshot({ path: `/tmp/fa_${name}.png`, fullPage: false });
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ---- USER SCREENS ----
  const uctx = await browser.newContext({ storageState: USER_STATE, viewport: { width: 1440, height: 900 } });
  const u = await uctx.newPage();

  for (const p of [u]) {
    await p.route("**/Prod/profile**", r => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ profile: { tokenBalance: 2500, name: "Test User" } }) }));
    await p.route("**/spend-tokens**", r => r.fulfill({ status: 200, body: '{"ok":true}' }));
  }

  const userPages = [
    ["u_dashboard",    "/user-dashboard"],
    ["u_companies",    "/user-companies"],
    ["u_professionals","/user-professionals"],
    ["u_events",       "/user-events"],
    ["u_posts",        "/user-posts"],
    ["u_mediahub",     "/user-media-hub"],
    ["u_addons",       "/user-addons"],
    ["u_leads",        "/user-leads"],
    ["u_contacted",    "/user-contacted"],
    ["u_website",      "/user-website"],
    ["u_recharge",     "/user-recharge"],
    ["u_transactions", "/user-transactions"],
    ["u_profile",      "/user-profile"],
  ];

  for (const [name, path] of userPages) {
    await u.goto(`http://localhost:5173${path}`);
    await u.waitForTimeout(1800);
    await ss(u, name);
    console.log("✓ user", name);
  }

  // ---- USER MOBILE ----
  const umctx = await browser.newContext({ storageState: USER_STATE, viewport: { width: 390, height: 844 }, isMobile: true });
  const um = await umctx.newPage();
  await um.route("**/Prod/profile**", r => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ profile: { tokenBalance: 2500 } }) }));

  for (const [name, path] of userPages) {
    await um.goto(`http://localhost:5173${path}`);
    await um.waitForTimeout(1500);
    await ss(um, `mob_${name}`);
    console.log("✓ mobile", name);
  }

  // ---- ADMIN SCREENS ----
  const actx = await browser.newContext({ storageState: ADMIN_STATE, viewport: { width: 1440, height: 900 } });
  const a = await actx.newPage();

  const adminPages = [
    ["a_login",         "/admin/login"],
    ["a_dashboard",     "/admin/company/dashboard"],
    ["a_users",         "/admin/users"],
    ["a_plans",         "/admin/plans"],
    ["a_professionals", "/admin/professional/dashboard"],
    ["a_events",        "/admin/event/dashboard"],
    ["a_media",         "/admin/media/dashboard"],
  ];

  for (const [name, path] of adminPages) {
    await a.goto(`http://localhost:5173${path}`);
    await a.waitForTimeout(1800);
    await ss(a, name);
    console.log("✓ admin", name);
  }

  await browser.close();
  console.log("All screenshots done");
})();
