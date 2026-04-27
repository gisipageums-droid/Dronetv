import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "./context/context";

export default function Logout() {
  const { logout, isAdminLogin } = useUserAuth();
  // Capture the initial admin state to determine redirection target
  // even after logout() clears the auth state.
  const wasAdmin = React.useRef(isAdminLogin);

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to={wasAdmin.current ? "/admin/login" : "/login"} replace />;
}
