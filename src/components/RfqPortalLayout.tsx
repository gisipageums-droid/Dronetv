import UserDashboardLayout from "./UserDashboard/components/layout/Layout";
import CompanyPortalLayout from "./CompanyPortal/CompanyPortalLayout";
import { useUserAuth } from "./context/context";

// The RFQ pages (/user-rfq/*) are a shared buyer action open to every account
// type, including company accounts posting their own requirement - see the
// comment in App.tsx on those routes. A company account still owns a company
// portal though, so showing it the generic member-portal shell there (while
// every other part of its account uses CompanyPortalLayout, reached from that
// shell's own "Post Requirement" link) is a jarring, inconsistent navigation
// switch. This picks the shell the same way CompanyRedirectGuard decides
// whether to redirect, without redirecting away from the shared RFQ pages.
export default function RfqPortalLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUserAuth();
  const role = (user as any)?.userData?.role || (user as any)?.role;
  const isAdmin = (user as any)?.userData?.isAdmin || (user as any)?.isAdmin;

  if (role === "company" && !isAdmin) {
    return <CompanyPortalLayout>{children}</CompanyPortalLayout>;
  }

  return <UserDashboardLayout>{children}</UserDashboardLayout>;
}
