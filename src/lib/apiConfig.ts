const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

// Auth service
export const AUTH_API = BACKEND
  ? `${BACKEND}/api/v1/auth`
  : null;

// Company service
export const COMPANY_API = BACKEND
  ? `${BACKEND}/api/v1/company`
  : null;

// Professional service
export const PROFESSIONAL_API = BACKEND
  ? `${BACKEND}/api/v1/professional`
  : null;

// Events service
export const EVENTS_API = BACKEND
  ? `${BACKEND}/api/v1/events`
  : null;

// Media service
export const MEDIA_API = BACKEND
  ? `${BACKEND}/api/v1/media`
  : null;

// Leads service
export const LEADS_API = BACKEND
  ? `${BACKEND}/api/v1/leads`
  : null;

// Payment service
export const PAYMENT_API = BACKEND
  ? `${BACKEND}/api/v1/payment`
  : null;

// Admin service
export const ADMIN_API = BACKEND
  ? `${BACKEND}/api/v1/admin`
  : null;

// Lambda base URLs (fallback — used when VITE_BACKEND_URL is not set)
export const LAMBDA = {
  auth:         'https://6gizqpfbmk.execute-api.ap-south-1.amazonaws.com/prod',
  company:      'https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod',
  companyAdmin: 'https://twd6yfrd25.execute-api.ap-south-1.amazonaws.com/prod',
  companyDraft: 'https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod',
  companyDraft2:'https://59rgr29n6b.execute-api.ap-south-1.amazonaws.com/dev',
  professional: 'https://zgkue3u9cl.execute-api.ap-south-1.amazonaws.com/prod',
  profForm:     'https://9zhkqwucj5.execute-api.ap-south-1.amazonaws.com/dev',
  profUpdate:   'https://tvlifa6840.execute-api.ap-south-1.amazonaws.com/prod',
  profAdmin:    'https://dfdooqn9k1.execute-api.ap-south-1.amazonaws.com/dev',
  profValidate: 'https://ei94o66irc.execute-api.ap-south-1.amazonaws.com/dev',
  profDelete:   'https://ss6lmkj0o8.execute-api.ap-south-1.amazonaws.com/prof',
  events:       'https://o9og9e2rik.execute-api.ap-south-1.amazonaws.com/prod',
  eventsAdmin:  'https://tl85vj590m.execute-api.ap-south-1.amazonaws.com/dev',
  eventsDelete: 'https://pjqm3sgpzf.execute-api.ap-south-1.amazonaws.com/dev',
  eventsVerify: 'https://dmxs169e33.execute-api.ap-south-1.amazonaws.com/dev',
  eventsForm:   'https://vfr3e0umwc.execute-api.ap-south-1.amazonaws.com/dev',
  media:        'https://quvfyw4hwc.execute-api.ap-south-1.amazonaws.com/prod',
  leads:        'https://g6x5kvufph.execute-api.ap-south-1.amazonaws.com/prod',
  leadsProf:    'https://q2u1cxalwg.execute-api.ap-south-1.amazonaws.com/prod',
  payment:      'https://4c5l9ys3yj.execute-api.ap-south-1.amazonaws.com/prod',
  plans:        'https://m6iy4nsz94.execute-api.ap-south-1.amazonaws.com/prod',
  plansAdmin:   'https://i8hkp4rc47.execute-api.ap-south-1.amazonaws.com/prod',
  adminForm:    'https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post',
  adminSectors: 'https://9smxz58iuh.execute-api.ap-south-1.amazonaws.com/Sectors-You-Serve',
  adminCats:    'https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage',
  adminGeo:     'https://decjfhu8qk.execute-api.ap-south-1.amazonaws.com/geography-of-operations',
  adminIngest:  'https://3qw4mfji02.execute-api.ap-south-1.amazonaws.com/prod',
  adminGen:     'https://18pvso3ggh.execute-api.ap-south-1.amazonaws.com/dev',
};
