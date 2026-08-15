import React from "react";
import MyContentManager from "../../UserDashboard/pages/MyContentManager";

// MyContentManager is a standalone page (own min-h-screen background + p-4
// md:p-6 padding) - negate the portal's own <main> padding so its full-bleed
// background doesn't show as a mismatched patch inside the portal shell.
export default function Content() {
  return (
    <div className="-m-4 sm:-m-6">
      <MyContentManager />
    </div>
  );
}
