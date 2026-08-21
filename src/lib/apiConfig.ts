// Global fallback — legacy all-or-nothing switch, kept for backward compatibility.
const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

// Per-service overrides — set only the ones you've cut over to Coolify.
// e.g. VITE_BACKEND_URL_AUTH=https://api-dev.dronetv.in while everything
// else keeps using Lambda. Falls back to the global BACKEND switch, then to
// Lambda (null) when neither is set. This is what makes incremental,
// service-by-service cutover possible instead of an all-or-nothing flip.
const SERVICE_OVERRIDES: Record<string, string> = {
  auth: import.meta.env.VITE_BACKEND_URL_AUTH || '',
  company: import.meta.env.VITE_BACKEND_URL_COMPANY || '',
  professional: import.meta.env.VITE_BACKEND_URL_PROFESSIONAL || '',
  events: import.meta.env.VITE_BACKEND_URL_EVENTS || '',
  media: import.meta.env.VITE_BACKEND_URL_MEDIA || '',
  leads: import.meta.env.VITE_BACKEND_URL_LEADS || '',
  payment: import.meta.env.VITE_BACKEND_URL_PAYMENT || '',
  admin: import.meta.env.VITE_BACKEND_URL_ADMIN || '',
  jobApplications: import.meta.env.VITE_BACKEND_URL_JOB_APPLICATIONS || '',
};

function serviceBase(name: keyof typeof SERVICE_OVERRIDES, path: string): string | null {
  const base = SERVICE_OVERRIDES[name] || BACKEND;
  return base ? `${base}/api/v1/${path}` : null;
}

// Auth service
export const AUTH_API = serviceBase('auth', 'auth');

// Company service
export const COMPANY_API = serviceBase('company', 'company');

// Professional service
export const PROFESSIONAL_API = serviceBase('professional', 'professional');

// Events service
export const EVENTS_API = serviceBase('events', 'events');

// Media service
export const MEDIA_API = serviceBase('media', 'media');

// Leads service
export const LEADS_API = serviceBase('leads', 'leads');

// Payment service
export const PAYMENT_API = serviceBase('payment', 'payment');

// Admin service
export const ADMIN_API = serviceBase('admin', 'admin');

// Lambda base URLs (fallback — used when VITE_BACKEND_URL is not set)
export const LAMBDA = {
  auth:              'https://6gizqpfbmk.execute-api.ap-south-1.amazonaws.com/prod',
  authLogin:         'https://yxzlfcqwf7.execute-api.ap-south-1.amazonaws.com/prod/login_post',
  authRegister:      'https://rnpcnionle.execute-api.ap-south-1.amazonaws.com/user_register_post',
  authForgot:        'https://ly8r7e8131.execute-api.ap-south-1.amazonaws.com/dev/forgot',
  authReset:         'https://omiuy3d12e.execute-api.ap-south-1.amazonaws.com/reset_password',
  authGoogle:   'https://67duf9ey84.execute-api.ap-south-1.amazonaws.com/google_log/Google_login',
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
  profPublish:  'https://bre0tniae1.execute-api.ap-south-1.amazonaws.com/prod',
  eventsPublish:'https://hilzq2z8ci.execute-api.ap-south-1.amazonaws.com/dev',
  profile:      'https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod',
  leadsChat:    'https://29c04nhq08.execute-api.ap-south-1.amazonaws.com/prod',
  transactions: 'https://vgrrxo3wu9.execute-api.ap-south-1.amazonaws.com/dev/drontv-token-buy-payment-gateway',
  tokenGateway: 'https://yv3392if0d.execute-api.ap-south-1.amazonaws.com/dev/drontv-token-buy-payment-gateway',
  adminLogin:   'https://mwbeqdpn09.execute-api.ap-south-1.amazonaws.com/prod',
  mediaUploads: 'https://wnznublu2f.execute-api.ap-south-1.amazonaws.com',
  promoForm:    'https://tty7xn2j01.execute-api.ap-south-1.amazonaws.com',
  companyRestoreJs: 'https://xe9l3knwqi.execute-api.ap-south-1.amazonaws.com/dev',
  products:     'https://f8wb4qay22.execute-api.ap-south-1.amazonaws.com/frontend-services-or-product',
  partner:      'https://0etsqrl2k1.execute-api.ap-south-1.amazonaws.com',
  contact:      'https://zlnlobchx7.execute-api.ap-south-1.amazonaws.com',
  adminLeads:   'https://zlnlobchx7.execute-api.ap-south-1.amazonaws.com',
  profTemplateSingle: 'https://t6nbbkwszi.execute-api.ap-south-1.amazonaws.com/prod2',
  profLeadContact: 'https://l7p8i65gl5.execute-api.ap-south-1.amazonaws.com/prod',
  profTemplateDash: 'https://xgnw16tgpi.execute-api.ap-south-1.amazonaws.com/dev',
  eventTemplateLoad: 'https://2kmz6d0aqa.execute-api.ap-south-1.amazonaws.com/prod',
  eventTemplateContent: 'https://2lksnliog8.execute-api.ap-south-1.amazonaws.com/prod',
  eventImageUpdate: 'https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev',
  eventPreview:   'https://fupab15ap0.execute-api.ap-south-1.amazonaws.com/dev',

  // Company form & templates
  companyFormDraft:   'https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod',
  companyFileUpload:  'https://1i8zpm4qu4.execute-api.ap-south-1.amazonaws.com/prod',
  companyTemplateLoad:'https://koxt4kvnni.execute-api.ap-south-1.amazonaws.com/dev',
  companyImageUpload: 'https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod',
  companyPreviewLoad: 'https://ykcimvca79.execute-api.ap-south-1.amazonaws.com/dev',
  companyDraftLoad:   'https://l0jg1d9hnc.execute-api.ap-south-1.amazonaws.com/dev',
  companyDraftMedia:  'https://c2x3twl1q8.execute-api.ap-south-1.amazonaws.com/dev',
  companyScrape:      'https://eqzkmjhfbc.execute-api.ap-south-1.amazonaws.com/dev1',

  // Events form & templates
  eventsFormDraft:    'https://9fszydao5h.execute-api.ap-south-1.amazonaws.com/prod',
  eventsFormBase:     'https://zhjkyvzz15.execute-api.ap-south-1.amazonaws.com/dev',
  eventsImageUpload:  'https://v96xyrv321.execute-api.ap-south-1.amazonaws.com/prod',
  formStructure:      'https://qemducz8gc.execute-api.ap-south-1.amazonaws.com/formstructure',
  formAdminUpdate:    'https://0i53elbzf2.execute-api.ap-south-1.amazonaws.com/dev',

  // Token economy — bids, placements, admin stats
  tokenSpend:     'https://vfqft3zag5.execute-api.ap-south-1.amazonaws.com',

  // Professional form & templates
  profTemplateLoad:      'https://0jj3p6425j.execute-api.ap-south-1.amazonaws.com/prod',
  profTemplateFinalLoad: 'https://l5fb7y1eij.execute-api.ap-south-1.amazonaws.com/dev',
  profUsernameCheck:     'https://0x1psamlyh.execute-api.ap-south-1.amazonaws.com/dev',
  profFormLoad:          'https://ec1amurqr9.execute-api.ap-south-1.amazonaws.com/dev',

  // Excel extractions
  profExcelUpload:    'https://0ang8mgh10.execute-api.ap-south-1.amazonaws.com/prod',
  profExcelGenerate:  'https://il6m5mp6ak.execute-api.ap-south-1.amazonaws.com/dev1',
  eventsExcelUpload:  'https://m6x894fyqk.execute-api.ap-south-1.amazonaws.com/dev2',
  eventsExcelGenerate:'https://9jkuuqgayb.execute-api.ap-south-1.amazonaws.com/dev',

  // Dashboard & leads
  profLeadsGet:          'https://r5mcwn6b10.execute-api.ap-south-1.amazonaws.com/prod',
  adminUserTemplates1:   'https://kgm0ckp0uf.execute-api.ap-south-1.amazonaws.com/dev',
  adminUserTemplates2:   'https://zd3q4ewnxe.execute-api.ap-south-1.amazonaws.com/dev',
  adminUserTemplates3:   'https://5otjcn6oi1.execute-api.ap-south-1.amazonaws.com/dev',

  // Webbuilder (legacy)
  webbuilderPost:     'https://6dcd2cnc76.execute-api.ap-south-1.amazonaws.com/postCompanyform',
  webbuilderGet:      'https://80lbhj32ja.execute-api.ap-south-1.amazonaws.com/singlecompany',
  webbuilderPortfolio:'https://ginc7xsgw8.execute-api.ap-south-1.amazonaws.com/portfolio',
  webbuilderS3Presign:'https://oljot50ikk.execute-api.ap-south-1.amazonaws.com/presign-upload',

  // Job Board ATS — applications/candidates
  jobApplications: 'https://kx8od78c4c.execute-api.ap-south-1.amazonaws.com/prod',
};

// Job Board ATS (applications) service
export const JOB_APPLICATIONS_API = serviceBase('jobApplications', 'job-applications');

// Pre-publish company template editor (no login yet — identified only by
// draftId/userId in the URL) has no JWT to send, so image uploads there
// must go through company-service's public presigned-URL route instead of
// the authed one. Mirrors Step1CompanyCategory.tsx's working uploadImageFile.
export async function uploadCompanyImagePresigned(
  userId: string,
  fieldName: string,
  file: File
): Promise<string | null> {
  try {
    const base = COMPANY_API ? `${COMPANY_API}/upload-file` : `${LAMBDA.companyFileUpload}/upload-file`;
    const presignRes = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        fieldName,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      }),
    });
    if (!presignRes.ok) return null;
    const presignData = await presignRes.json();
    if (!presignData.success) return null;

    const putRes = await fetch(presignData.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!putRes.ok) return null;

    return presignData.imageUrl as string;
  } catch (error) {
    console.error("uploadCompanyImagePresigned failed:", error);
    return null;
  }
}

// Post-login company template editor (editing an already-published company
// from the logged-in dashboard) — this route is authed on the backend, so
// it needs the real Bearer token, unlike the pre-publish flow above.
export async function uploadCompanyImageAuthed(
  userId: string,
  publishedId: string,
  file: File
): Promise<string | null> {
  try {
    const base = COMPANY_API
      ? `${COMPANY_API}/upload-image/${userId}/${publishedId}`
      : `${LAMBDA.companyImageUpload}/upload-image/${userId}/${publishedId}`;
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(base, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.url || data.imageUrl || null) as string | null;
  } catch (error) {
    console.error("uploadCompanyImageAuthed failed:", error);
    return null;
  }
}
