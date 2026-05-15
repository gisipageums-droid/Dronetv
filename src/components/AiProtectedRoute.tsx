import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "./context/context";

const AiProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLogin, isAdminLogin } = useUserAuth();
  if (!isLogin && !isAdminLogin) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default AiProtectedRoute;
