# DroneTv — Testing Guide

**Dev URL**: https://dev.dronetv.in
**Prod URL**: https://dronetv.in

---

## USER FLOW

---

### 1. Login & Dashboard

**Steps:**
- [ ] Open dev.dronetv.in → click Login → enter test user credentials → submit
- [ ] Redirected to /user-dashboard after login
- [ ] Sidebar visible on left — all 4 groups expanded by default:
  - My Listings → Companies, Professionals, Events
  - Content → My Posts, Media Hub, Addons
  - Analytics → Leads, Contacted
  - Account → Website, Recharge, Transactions
- [ ] Click any group header → group collapses
- [ ] Click same group header again → group expands
- [ ] Navigate to a sub-page → that group stays highlighted/active
- [ ] Token balance visible at bottom of sidebar
- [ ] User name and email visible at bottom of sidebar

---

### 2. Companies — /user-companies

**Steps:**
- [ ] Click Companies in sidebar → page loads
- [ ] Listing limit bar visible (e.g. 0 / 2)
- [ ] "+ Add New Company" button visible at top
- [ ] If no companies: empty state message shown correctly
- [ ] If company exists: listing card shows with edit/manage options
- [ ] Search bar filters results correctly

---

### 3. Professionals — /user-professionals

**Steps:**
- [ ] Click Professionals in sidebar → page loads
- [ ] Listing limit bar visible (e.g. 0 / 15 for Scale plan)
- [ ] "+ Add New Professional" button visible
- [ ] Empty state: "No professional profiles found. Click Add New Professional to create one."
- [ ] Search bar visible and functional

---

### 4. Events — /user-events

**Steps:**
- [ ] Click Events in sidebar → page loads
- [ ] Listing limit bar visible (e.g. 0 / 10)
- [ ] "+ Create New Event" button visible
- [ ] Empty state with no search active: "No events yet. Click Create New Event to add one."
- [ ] Type text in search bar → message changes to: No events found matching "xyz"
- [ ] Clear search bar → message reverts to default (no empty quotes shown)

---

### 5. My Posts — /user-posts

#### Submit a Post
- [ ] Click My Posts in sidebar → page loads
- [ ] 4 content type tabs visible: Promotional Post, Editorial Article, DroneTv News Post, Press Release
- [ ] Each tab shows used/limit count (e.g. 0/6) and plan badge
- [ ] Tabs not in plan show "Not in your plan" and are disabled
- [ ] Click Promotional Post tab → click "+ Submit New Promotional Post"
- [ ] Form expands below the tabs
- [ ] Fill in Title and Content (minimum 10 characters)
- [ ] Click Submit → post appears in the list below with status badge "submitted"
- [ ] Counter increments (0/6 → 1/6)
- [ ] Success toast notification shows

#### Edit a Post
- [ ] Find a post with status "submitted" or "rejected" → pencil icon should be visible
- [ ] Find a post with status "approved" or "published" → pencil icon should NOT appear
- [ ] Click pencil icon on a submitted/rejected post
- [ ] Form scrolls to top and pre-fills with existing title and content
- [ ] Blue info banner visible: "Editing — post will be resubmitted for review after saving"
- [ ] Form submit button shows "Save & Resubmit"
- [ ] Edit the content → click "Save & Resubmit"
- [ ] Post updates in list with new content
- [ ] Status resets to "submitted"
- [ ] Updated timestamp changes

#### Delete a Post
- [ ] Trash icon visible on every post (regardless of status)
- [ ] Click trash icon on any post
- [ ] Confirm modal appears with post title and content preview
- [ ] Click Cancel → modal closes, post remains unchanged
- [ ] Click trash again → click Delete button
- [ ] Post removed from list
- [ ] Success toast: "Post deleted."

---

### 6. Media Hub — /user-mediahub

**Steps:**
- [ ] Click Media Hub in sidebar → page loads
- [ ] Plan badge and token balance shown at top
- [ ] "Included In Your Plan" section lists deliverables:
  - Each item shows type tag (VIDEO / ARTICLE / SOCIAL / MAGAZINE)
  - Status tags: Pending / In Progress / Delivered
- [ ] Click expand arrow on any item → details expand
- [ ] "Upgrade To Unlock" section shows locked items greyed out with Upgrade link

---

### 7. Addons — /user-addons

**Steps:**
- [ ] Click Addons in sidebar → page loads
- [ ] Token balance shown at top with "Top Up" button
- [ ] "Services" tab active by default — grid of add-ons with token prices
- [ ] "Active (0)" tab visible — click it → empty if no addons purchased
- [ ] Click "Buy Now" on any addon → confirm modal appears with addon details
- [ ] Click Cancel → modal closes, nothing purchased
- [ ] Click Buy Now again → click Confirm → tokens deducted from balance
- [ ] Active tab count increments (0 → 1)
- [ ] Purchased addon appears in Active tab
- [ ] If Featured Placement or Priority Search purchased → yellow banner shows at top of page

---

### 8. Leads — /user-leads

**Steps:**
- [ ] Click Leads in sidebar → page loads
- [ ] Brief "Loading..." shown while API fetches (normal — resolves quickly)
- [ ] If no companies registered: "No companies found." with "Go to Companies" button
- [ ] Click "Go to Companies" → navigates to /user-companies
- [ ] If company exists: leads listed with search and filter options
- [ ] Clicking a lead that requires tokens → unlock modal appears

---

### 9. Contacted — /user-contacted

**Steps:**
- [ ] Click Contacted in sidebar → page loads
- [ ] "Contacted People" heading with subtitle visible
- [ ] Search bar functional — type to filter
- [ ] Dropdown filter (all / companies / professionals / etc.) works
- [ ] "Card" and "Table" toggle buttons switch between views
- [ ] Empty state: "No contacts found."

---

### 10. Website — /user-website

**Steps:**
- [ ] Click Website in sidebar → page loads
- [ ] If no company registered: globe icon + "No Website Yet" heading
- [ ] Subtext: "You haven't created your company website yet. Register your company to get a public listing page."
- [ ] "Create Your Website" button → navigates to company registration

---

### 11. Recharge (Plans) — /user-recharge

**Steps:**
- [ ] Click Recharge in sidebar → plan cards load from API
- [ ] Filter bar visible: All, One-Time, Monthly, Quarterly, Yearly
- [ ] Click each filter → cards filter correctly
- [ ] Discount badge shown on eligible plans (e.g. 10% OFF)
- [ ] Click "Select Plan" on any plan → Razorpay checkout modal opens
- [ ] **On dev.dronetv.in**: Razorpay modal must show yellow "Test Mode" banner at top
- [ ] **On dronetv.in (prod)**: No Test Mode banner (live mode)
- [ ] Click × to dismiss checkout → modal closes cleanly, no stuck loading

#### Buy Tokens (custom amount) — /user-buy
- [ ] Enter amount less than ₹10 → Pay Now button stays disabled
- [ ] Enter ₹100 → token preview shows "₹100 → 10 tokens"
- [ ] Click Pay Now → Razorpay checkout opens
- [ ] Dev must show Test Mode, prod must not
- [ ] Dismiss checkout → no stuck loader or errors

---

### 12. Transactions — /user-transactions

**Steps:**
- [ ] Click Transactions in sidebar → page loads
- [ ] "Transaction History" heading with subtitle visible
- [ ] Search bar: type amount or status → filters results
- [ ] Date picker filter works
- [ ] Empty state: "No transactions found" with document icon and subtext

---

### 13. Profile — /user-profile

**Steps:**
- [ ] Click Profile or account area → /user-profile loads
- [ ] Account Details card visible: FullName, City, State, Phone Number
- [ ] "Reset Password" row has a lock icon visible before the text (not blank)
- [ ] Click "Edit Profile" → edit form opens with current values
- [ ] Token Balance card: shows current token count with star icon
- [ ] Click "Buy More Tokens" button → modal opens
  - [ ] Modal X (close) button clearly visible top right
  - [ ] Clicking X → modal closes cleanly
- [ ] "Recent Activity" section visible
- [ ] Click "See More Transactions" → All Transactions modal opens
  - [ ] Search bar inside modal works
  - [ ] Modal X button clearly visible top right
  - [ ] Clicking X → modal closes cleanly

---

### 14. Forgot Password — /forgot-password (must be logged out)

**Steps:**
- [ ] Logout first, then go to /forgot-password
- [ ] DroneTv logo image shown at top of card (not text saying "logo")
- [ ] Enter email address → click Submit
- [ ] Success screen appears — DroneTv logo also shown here (not text)
- [ ] "Back to Login" link works

---

### 15. Mobile View

Open on mobile browser or Chrome DevTools mobile emulation (375px width):

- [ ] Home page and navbar display correctly
- [ ] Login page: full width form, no overflow
- [ ] After login — bottom navigation bar visible:
  - Dashboard, Companies, Recharge, Leads, More
- [ ] Tap "More" → full navigation menu opens
- [ ] Hamburger menu opens sidebar and closes cleanly
- [ ] Dashboard sidebar: all groups visible when opened
- [ ] My Posts: submit form stacks correctly, tabs scroll horizontally
- [ ] Profile page: Account Details card on top, Token Balance card below (stacked)
- [ ] Transaction History: search and date inputs stack vertically
- [ ] Media Hub: deliverables list scrollable, no horizontal overflow
- [ ] Contacted People: Card/Table toggle works
- [ ] Recharge: plan cards stack to single column
- [ ] No page has horizontal scroll on mobile

---

## ADMIN FLOW

**Login**: /admin/login → admin credentials

---

### 1. Dashboard — /admin

**Steps:**
- [ ] Login with admin credentials → redirected to admin dashboard
- [ ] Summary cards visible: Total Users, Companies, Professionals, Events
- [ ] Recent registrations listed
- [ ] "View Site" button top right → opens dronetv.in in new tab
- [ ] Notification bell visible in header

---

### 2. Users — /admin/users

**Steps:**
- [ ] Click Users in sidebar → users table loads
- [ ] Search by name or email → filters rows correctly
- [ ] Table shows: name, email, registration date, status
- [ ] Click a user row → detail drawer slides in from right side
- [ ] Drawer shows: profile info, company/professional linked details, stats
- [ ] Approve button works, Reject button works
- [ ] "Edit Company Details" in drawer → navigates to admin edit form for that company
- [ ] Edit form loads with company data pre-filled

---

### 3. Company Listings — /admin/companies

**Steps:**
- [ ] Click Company Listings in sidebar → companies table loads
- [ ] Search by company name works
- [ ] Status filter (pending / approved / rejected) filters correctly
- [ ] Click a company row → detail view opens with full company info
- [ ] Approve company → status changes
- [ ] Reject company → status changes
- [ ] Edit company details form loads with pre-filled data and saves correctly

---

### 4. Professionals — /admin/professionals

**Steps:**
- [ ] Click Professionals → expand submenu:
  - Job Board, Pilot Directory, Certifications, Training/RPTOs, Networking, Community
- [ ] Click each sub-section → lists submissions from users
- [ ] Search works in each section
- [ ] Approve / Reject actions work

---

### 5. Media Hub — /admin/mediahub

**Steps:**
- [ ] Click Media Hub → expand submenu:
  - News Pulse, Magazine, Video Spotlight, Gallery, Impact Stories, Market Intelligence, Tech Trends, Press Releases, Industry Reports
- [ ] Click each section → content items listed with type tags
- [ ] Add new content item works
- [ ] Edit and Delete existing items work

---

### 6. Events — /admin/events

**Steps:**
- [ ] Click Events → expand submenu:
  - Event Calendar, Expos, Conferences, Workshops, Competitions, Webinars, Meetups
- [ ] Events listed with dates and locations
- [ ] Create New Event → form opens, fills, saves
- [ ] Edit existing event → form pre-fills correctly
- [ ] Delete event → removed from list

---

### 7. Partnerships — /admin/partnerships

**Steps:**
- [ ] Click Partnerships → partners listed
- [ ] Add / Edit / Delete partners works

---

### 8. Packages & Revenue — /admin/plans

**Steps:**
- [ ] Click Packages & Revenue → plan tiers listed (Free, Reach, Scale, Brand)
- [ ] Token amounts and feature limits visible per plan
- [ ] Edit plan details → saves correctly

---

### 9. Invoices — /admin/invoices

**Steps:**
- [ ] Click Invoices → full transaction table loads
- [ ] Columns visible: Transaction ID, User, Date, Amount, Tokens, Status
- [ ] Status badges: PENDING (amber), CAPTURED (green)
- [ ] Search by email or transaction ID → filters correctly
- [ ] "Export CSV" button visible top right → downloads file
- [ ] All Razorpay orders appear here including test transactions

---

### 10. Settings — /admin/settings

**Steps:**
- [ ] Click Settings → settings page loads
- [ ] General section: Site Name field shows "DroneTv.in", editable
- [ ] Support Email field shows "bd@dronetv.in", editable
- [ ] Notifications section: 3 toggles (New company registration ON, New event submission ON, New professional profile OFF)
- [ ] Toggle each → state saves
- [ ] Security section: Maintenance mode toggle (should be OFF)
- [ ] Contact Info section: shows admin panel URL, email, website
- [ ] Click "Save Changes" → changes saved, confirmation shown

---

## QUICK SMOKE TEST (5 minutes)

| # | Test | URL |
|---|---|---|
| 1 | Login → sidebar all 4 groups visible | /user-dashboard |
| 2 | My Posts → submit → edit → delete | /user-posts |
| 3 | Profile → lock icon visible → both modal X buttons work | /user-profile |
| 4 | Forgot Password → DroneTv logo shown (not text) | /forgot-password |
| 5 | Events → empty state no empty quotes | /user-events |
| 6 | Recharge → Razorpay opens in Test Mode on dev | /user-recharge |
| 7 | Leads → loads and shows correct empty state | /user-leads |
| 8 | Admin login → Invoices table loads | /admin/invoices |
| 9 | Admin Settings → all 4 sections visible, Save works | /admin/settings |
| 10 | Mobile → bottom nav, all pages responsive | mobile view |
