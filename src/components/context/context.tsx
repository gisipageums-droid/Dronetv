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
import { CheckCircle } from "lucide-react";
// User Authentication Types and Context
interface User {
  email: string;
  fullName: string;
  token?: string;
  // Add other user properties as needed
}

interface UserAuthContextType {
  user: User | null;
  isLogin: boolean;
  login: (userData: User) => void;
  logout: () => void;
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
  const [haveAccount, setHaveAccount] = useState<boolean>(true);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const isLogin = !!user;

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLogin,
        login,
        logout,
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

// Template Management Types and Context
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
  const { isLogin } = useUserAuth();

  function navigatemodel() {
   
      return (
        <motion.div
          className="fixed top-0 left-0 w-full h-full backdrop-blur-md bg-black/70 flex items-center justify-center z-[999999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">
                  Successfully Published!
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                You have successfully published your template.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/")}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition-colors"
              >
                Go to Home
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Go to Login
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      );
 
  }

  //pulish final template
  async function fetchAPI() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        // `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${AIGenData.userId}/update/${AIGenData.publishedId}`,
        `https://59rgr29n6b.execute-api.ap-south-1.amazonaws.com/dev/update`,
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
      console.log("Upload successful:", result);
      toast.success(
        "Your site is successfully published and now it is under review"
      );

      if (isLogin === false) {
        setNavModel(true);
        // navigatemodel();
      } else {
        navigate("/user-companies");
        setNavModel(false);
      }

      setAIGenData({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Something went wrong...");
    }
  }

  //edit and publish final template

  async function editFetchAPI() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        // `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${finaleDataReview.userId}/update/${finaleDataReview.publishedId}`,
        `https://59rgr29n6b.execute-api.ap-south-1.amazonaws.com/dev/update`,
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
      console.log("Upload successful:", result);
      toast.success(
        "Your site is successfully published and now it is under review"
      );
      navigate("/user-companies");
      setFinaleDataReview({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Something went wrong...");
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

  useEffect(() => {
    console.log("finalData:", finalTemplate);
  }, [finalTemplate]);

  useEffect(() => {
    console.log("final preview data:", finaleDataReview);
  }, [finaleDataReview]);

  async function publishProfessionalTemplate() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        `https://tlpun4lz89.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${AIGenData.userId}/update/${AIGenData.professionalId}?template=${AIGenData.templateSelection}`,
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
      console.log("Upload successful:", result);
      toast.success(
        "Your template is successfully published and now it is under review"
      );
      navigate("/user/professional");
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
        navigatemodel
        
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
