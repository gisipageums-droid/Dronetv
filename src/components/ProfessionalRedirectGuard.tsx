import { Navigate } from "react-router-dom";
import { useUserAuth } from "./context/context";

// Mirror of CompanyRedirectGuard for the professional role — keeps a
// professional-account user out of the legacy /user-* dashboard and on
// their own /professional-portal, regardless of how they got to the URL.
export default function ProfessionalRedirectGuard({ to, children }: { to: string; children: React.ReactNode }) {
  const { user } = useUserAuth();
  const role = (user as any)?.userData?.role || (user as any)?.role;
  const isAdmin = (user as any)?.userData?.isAdmin || (user as any)?.isAdmin;

  if (role === "professional" && !isAdmin) {
    return <Navigate to={to} replace />;
  }

  return children;
}
