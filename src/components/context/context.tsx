import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { CheckCircle, X } from "lucide-react";
import { COMPANY_API, PROFESSIONAL_API, EVENTS_API, LAMBDA } from '../../lib/apiConfig';
import { validateToken, getMe, clearSession } from '../../lib/authService';

// User Authentication Types and Context
interface User {
  email: string;
  fullName: string;
  id?: string;
  role?: string;
  isAdmin?: boolean;
  token?: string;
  timestamp?: string;
  userData?: {
    id?: string;
    email?: string;
    fullName?: string;
    city?: string;
    state?: string;
    phone?: string;
    role?: string;
    isAdmin?: boolean;
    [key: string]: any;
  };
}

interface Admin {
  email: string;
  name?: string;
  token?: string;
  timestamp?: string;
  adminData?: {
    email?: string;
    userName?: string;
    city?: string;
    role?: string;
    isAdmin?: boolean;
    state?: string;
    [key: string]: any;
  };
}

interface UserAuthContextType {
  user: User | null;
  admin: Admin | null;
  isLogin: boolean;
  isAdminLogin: boolean;
  login: (userData: User) => void;
  adminLogin: (adminData: Admin) => void;
  logout: () => void;
  adminLogout: () => void;
  refreshUser: () => Promise<void>;
  haveAccount: boolean;
  setHaveAccount: React.Dispatch<React.SetStateAction<boolean>>;
  accountEmail: string | null;
  setAccountEmail: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(
  undefined
);

interface UserAuthProviderProps {
  children: ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [admin, setAdmin] = useState<Admin | null>(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  const [haveAccount, setHaveAccount] = useState<boolean>(true);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const isLogin = !!user;
  const isAdminLogin = !!admin;

  const login = (userData: User) => {
    const userToStore = {
      ...userData,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("user", JSON.stringify(userToStore));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    setUser(userToStore);
  };

  const adminLogin = (adminData: Admin) => {
    const adminToStore = {
      ...adminData,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("admin", JSON.stringify(adminToStore));
    if (adminData.token) {
      localStorage.setItem("adminToken", adminData.token);
    }

    // Also store adminData separately for easy access
    if (adminData.adminData) {
      localStorage.setItem("adminData", JSON.stringify(adminData.adminData));
    }

    setAdmin(adminToStore);
  };

  const refreshUser = async () => {
    try {
      const fresh = await getMe();
      const updated = {
        email: fresh.email,
        fullName: fresh.fullName,
        id: fresh.id,
        role: fresh.role,
        isAdmin: fresh.isAdmin,
        token: localStorage.getItem('token') || undefined,
        timestamp: new Date().toISOString(),
        userData: fresh,
      };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    } catch {
      // Token invalid — clear session
      clearSession();
      setUser(null);
      setAdmin(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      validateToken().then(valid => {
        if (!valid) {
          clearSession();
          setUser(null);
          setAdmin(null);
        }
      });
    }
  }, []);

  // Listen for background profile fetch completing (role update)
  useEffect(() => {
    const handleRoleUpdate = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
      }
    };
    window.addEventListener('user-role-updated', handleRoleUpdate);
    return () => window.removeEventListener('user-role-updated', handleRoleUpdate);
  }, []);

  const logout = () => {
    clearSession();
    setUser(null);
    setAdmin(null);
  };

  const adminLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setAdmin(null);
  };

  // Load admin data from localStorage on component mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error("Error parsing stored admin data:", error);
        localStorage.removeItem("admin");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
      }
    }
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        admin,
        isLogin,
        isAdminLogin,
        login,
        adminLogin,
        logout,
        adminLogout,
        refreshUser,
        haveAccount,
        setHaveAccount,
        accountEmail,
        setAccountEmail,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}

// In TemplateContextType interface, add the missing function:
interface TemplateContextType {
  draftDetails: any | [];
  setDraftDetails: React.Dispatch<React.SetStateAction<any | []>>;
  AIGenData: any | [];
  setAIGenData: React.Dispatch<React.SetStateAction<any | []>>;
  isPublishedTriggered: boolean;
  setIsPublishedTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  finalTemplate: any | [];
  setFinalTemplate: React.Dispatch<React.SetStateAction<any | []>>;
  publishTemplate: () => void;
  finaleDataReview: any | [];
  setFinaleDataReview: React.Dispatch<React.SetStateAction<any | []>>;
  editPublishTemplate: () => void;
  publishProfessionalTemplate: () => void;
  publishEventsTemplate: () => void;
  navModel: boolean;
  setNavModel: React.Dispatch<React.SetStateAction<boolean>>;
  navigatemodel: () => JSX.Element;
  getAIgenData: (
    userId: string,
    draftId: string,
    templateSelection: string
  ) => Promise<void>;
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined
);

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({
  children,
}) => {
  const [draftDetails, setDraftDetails] = useState<any | []>({});
  const [isPublishedTriggered, setIsPublishedTriggered] =
    useState<boolean>(false);
  const [finalTemplate, setFinalTemplate] = useState<any | []>({});
  const [AIGenData, setAIGenData] = useState<any>({});
  const [finaleDataReview, setFinaleDataReview] = useState<any | []>({});
  const [navModel, setNavModel] = useState(false);
  const navigate = useNavigate();
  const { isLogin, isAdminLogin } = useUserAuth();

  function navigatemodel() {
    return (
      <motion.div
        className="fixed top-0 left-0 w-full h-full backdrop-blur-md bg-ink/70 flex items-center justify-center z-[999999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-surface-card rounded-xl shadow-2xl max-w-md w-full p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-status-success" size={24} />
              <h3 className="text-xl font-semibold text-ink">
                Successfully Published!
              </h3>
            </div>
            <button
              onClick={() => setNavModel(false)}
              className="p-1 rounded-full hover:bg-ink-light transition-colors"
            >
              <X size={20} className="text-ink-caption" />
            </button>
          </div>
          <div className="mb-6">
            <p className="text-ink-paragraph">
              Your company listing is now live! Your login credentials have been sent to your registered email address. You can log in to manage your listing anytime.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => { setNavModel(false); navigate("/listed-companies"); }}
              className="px-4 py-2 text-ink-paragraph font-medium rounded-lg border border-ink-light bg-surface-card hover:bg-ink-light transition-colors"
            >
              View Companies
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => { setNavModel(false); navigate("/login"); }}
              className="px-4 py-2 bg-status-info text-white font-medium rounded-lg hover:bg-status-info transition-colors shadow-md"
            >
              Log In
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const API = COMPANY_API ? `${COMPANY_API}/draft` : `${LAMBDA.companyDraft}/api/draft`;
  //get API AI gen data :
  const getAIgenData = async (
    userId: string,
    draftId: string,
    templateSelection: string
  ) => {
    if (!userId || !draftId) {
      console.error("Missing userId or draftId");
      toast.error("Missing required parameters");
      return;
    }

    try {
      const response = await fetch(
        `${API}/${userId}/${draftId}?template=${templateSelection}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add validation for the response data
      if (data && (data.content || data.publishedId)) {
        toast.success(`AI generated the data successfully`, {
          toastId: "ai-success2",
        });
        setAIGenData(data);
      } else {
        throw new Error("Invalid data structure in response");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to load AI generated data");
    }
  };

  //pulish final template
  async function fetchAPI() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const PLACEHOLDER_COMPANY_NAMES = new Set(['company name', 'innovative labs', 'your company', 'unnamed company']);
      const isRealName = (n: string) => !!n && !PLACEHOLDER_COMPANY_NAMES.has(n.toLowerCase().trim());
      const nameCandidates = [
        finalTemplate?.content?.header?.companyName,
        finalTemplate?.content?.profile?.companyName,
        finalTemplate?.content?.company?.name,
      ];
      const extractedName = (nameCandidates.find(n => isRealName((n || '').trim())) || '').trim();
      const body = extractedName ? { ...finalTemplate, companyName: extractedName } : finalTemplate;
      const response = await fetch(
        COMPANY_API ? `${COMPANY_API}/draft/update` : `${LAMBDA.companyDraft2}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.publishedId) {
        setAIGenData(prev => ({ ...prev, publishedId: result.publishedId }));
      }
      toast.success("Your company is now live!");

      if (isAdminLogin) {
        navigate("/admin/company/dashboard");
        setNavModel(false);
      } else if (isLogin) {
        navigate("/user-website");
        setNavModel(false);
      } else {
        setNavModel(true);
      }

      setAIGenData({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to publish. Please try again.");
    }
  }

  //edit and publish final template

  async function editFetchAPI() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const PLACEHOLDER_COMPANY_NAMES = new Set(['company name', 'innovative labs', 'your company', 'unnamed company']);
      const isRealName = (n: string) => !!n && !PLACEHOLDER_COMPANY_NAMES.has(n.toLowerCase().trim());
      const nameCandidates = [
        finalTemplate?.content?.header?.companyName,
        finalTemplate?.content?.profile?.companyName,
        finalTemplate?.content?.company?.name,
      ];
      const extractedName = (nameCandidates.find(n => isRealName((n || '').trim())) || '').trim();
      const body = extractedName ? { ...finalTemplate, companyName: extractedName } : finalTemplate;
      const response = await fetch(
        COMPANY_API ? `${COMPANY_API}/draft/update` : `${LAMBDA.companyDraft2}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.publishedId) {
        setAIGenData(prev => ({ ...prev, publishedId: result.publishedId }));
      }
      toast.success("Your company is now live!");
      if (isAdminLogin) {
        navigate("/admin/company/dashboard");
        setNavModel(false);
      } else if (isLogin) {
        navigate("/user-website");
        setNavModel(false);
      } else {
        setNavModel(true);
      }
      setFinaleDataReview({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to publish. Please try again.");
    }
  }

  function publishTemplate() {
    setIsPublishedTriggered(true);
    // Add a small delay to ensure state updates are processed
    setTimeout(() => {
      fetchAPI();
    }, 100);
  }
  function editPublishTemplate() {
    setIsPublishedTriggered(true);
    // Add a small delay to ensure state updates are processed
    setTimeout(() => {
      editFetchAPI();
    }, 100);
  }

  async function publishProfessionalTemplate() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        PROFESSIONAL_API ? `${PROFESSIONAL_API}/publish` : `${LAMBDA.profPublish}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalTemplate),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success(
        "Your template is successfully published and now it is under review"
      );

      if (isAdminLogin) {
        navigate("/admin/professional/dashboard");
        setNavModel(false);
      } else if (isLogin) {
        navigate("/user-professionals");
        setNavModel(false);
      } else {
        setNavModel(true);
      }
      setAIGenData({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Something went wrong...");
    }
  }

  // event form
  async function publishEventsTemplate() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      // Extract event name from content so the Lambda can update the top-level attribute
      const eventName = (
        finalTemplate?.content?.header?.eventName ||
        finalTemplate?.content?.footer?.eventName ||
        finalTemplate?.header?.eventName ||
        finalTemplate?.footer?.eventName ||
        ''
      ).trim();

      // The publish Lambda requires eventId/userId (and the rest of the draft
      // metadata) nested INSIDE `content`, with the actual edited template
      // itself nested a level deeper as `content.content` — not as top-level
      // sibling fields. See dronetv-events-update-functionality-2 source.
      // Older drafts saved before an eventId was persisted don't have one —
      // fall back to draftId, which is always present and equally unique.
      const data: any = {
        content: {
          ...AIGenData,
          eventId: AIGenData.eventId || AIGenData.draftId,
          content: finalTemplate,
          ...(eventName ? { eventName } : {}),
        },
      };

      const response = await fetch(
        EVENTS_API ? `${EVENTS_API}/publish` : `${LAMBDA.eventsPublish}/events-publish/event-publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If admin is publishing, auto-approve so event stays visible in public list
      if (isAdminLogin && AIGenData.eventId) {
        try {
          await fetch(
            EVENTS_API ? `${EVENTS_API}/event/${AIGenData.eventId}` : `${LAMBDA.eventsAdmin}/event/${AIGenData.eventId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ eventId: AIGenData.eventId, action: "approve", userId: AIGenData.userId }),
            }
          );
        } catch { /* best effort */ }
      }

      toast.success(
        isAdminLogin
          ? "Event updated and published successfully"
          : "Your template is successfully published and now it is under review"
      );
      if (isAdminLogin) {
        navigate("/admin/event/dashboard");
        setNavModel(false);
      } else if (isLogin) {
        navigate("/user-events");
        setNavModel(false);
      } else {
        setNavModel(true);
      }
      setAIGenData({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Something went wrong...");
    }
  }

  return (
    <TemplateContext.Provider
      value={{
        draftDetails,
        setDraftDetails,
        AIGenData,
        setAIGenData,
        isPublishedTriggered,
        setIsPublishedTriggered,
        finalTemplate,
        setFinalTemplate,
        publishTemplate,
        publishProfessionalTemplate,
        setFinaleDataReview,
        finaleDataReview,
        editPublishTemplate,
        navModel,
        setNavModel,
        navigatemodel,
        getAIgenData,
        publishEventsTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
}

// Combined Provider for easier app integration
interface CombinedProvidersProps {
  children: ReactNode;
}

export const CombinedProviders: React.FC<CombinedProvidersProps> = ({
  children,
}) => {
  return (
    <UserAuthProvider>
      <TemplateProvider>{children}</TemplateProvider>
    </UserAuthProvider>
  );
};
