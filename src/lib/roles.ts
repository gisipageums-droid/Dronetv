export const ROLES = {
  USER: 'user',
  COMPANY: 'company',
  PROFESSIONAL: 'professional',
  EVENT_ORGANIZER: 'event_organizer',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export function hasRole(userRole: string | undefined, required: Role | Role[]): boolean {
  if (!userRole) return false;
  const roles = Array.isArray(required) ? required : [required];
  return roles.includes(userRole as Role);
}

export function canAccess(userRole: string | undefined, isAdmin: boolean | undefined, required: Role | Role[]): boolean {
  if (isAdmin) return true;
  return hasRole(userRole, required);
}

// What each role is allowed to do
export const PERMISSIONS = {
  manageCompany:       (r: string) => [ROLES.COMPANY, ROLES.ADMIN].includes(r as Role),
  manageProfessional:  (r: string) => [ROLES.PROFESSIONAL, ROLES.ADMIN].includes(r as Role),
  manageEvents:        (r: string) => [ROLES.EVENT_ORGANIZER, ROLES.ADMIN].includes(r as Role),
  viewLeads:           (r: string) => [ROLES.COMPANY, ROLES.PROFESSIONAL, ROLES.EVENT_ORGANIZER, ROLES.ADMIN].includes(r as Role),
  useTokens:           (r: string) => r !== ROLES.USER || true, // all logged-in users
  accessAI:            (_r: string, isAdmin?: boolean) => !!isAdmin,
  accessAdminPanel:    (_r: string, isAdmin?: boolean) => !!isAdmin,
} as const;
