import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from './context/context';
import { Role, canAccess } from '../lib/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: Role | Role[];
  redirectTo?: string;
}

export default function RoleGuard({ children, roles, redirectTo = '/user-dashboard' }: RoleGuardProps) {
  const { user, isLogin, isAdminLogin } = useUserAuth();

  if (!isLogin && !isAdminLogin) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role || 'user';
  const isAdmin = user?.isAdmin || isAdminLogin;

  if (!canAccess(role, isAdmin, roles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
