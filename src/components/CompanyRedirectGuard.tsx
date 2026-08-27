import { Navigate } from "react-router-dom";
import { useUserAuth } from "./context/context";

export default function CompanyRedirectGuard({ to, children }: { to: string; children: React.ReactNode }) {
  const { user } = useUserAuth();
  const role = (user as any)?.userData?.role || (user as any)?.role;
  const isAdmin = (user as any)?.userData?.isAdmin || (user as any)?.isAdmin;

  if (role === "company" && !isAdmin) {
    return <Navigate to={to} replace />;
  }

  return children;
}
