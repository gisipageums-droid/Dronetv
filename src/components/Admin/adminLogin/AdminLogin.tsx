import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserAuth } from "../../context/context";
import { toast } from "react-toastify";

interface LoginData {
  email: string;
  password: string;
}

// API endpoint
const ADMIN_LOGIN_API = "https://mwbeqdpn09.execute-api.ap-south-1.amazonaws.com/prod/dev";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const { adminLogin } = useUserAuth();
  const navigate = useNavigate();

  const onLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  // Handle admin login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!loginData.email || !loginData.password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(ADMIN_LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Admin login successful!");
        // navigate("/admin/plans");
        // Store admin data in context and localStorage using adminLogin
        adminLogin({
          email: data.adminData?.email || loginData.email,
          name: data.adminData?.userName || "Admin User",
          // token: data.token, // Add if API returns token
          adminData: {
            ...data.adminData,
            // Include all adminData fields
            city: data.adminData?.city,
            role: data.adminData?.role,
            isAdmin: data.adminData?.isAdmin,
            state: data.adminData?.state,
            userName: data.adminData?.userName
          }
        });

        setLoginData({
          email: "",
          password: "",
        });

        navigate("/admin/plans");
      } else {
        toast.error(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      toast.error("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (value: string) => {
    return `w-full p-2 border rounded ${
      !value ? "border-gray-300" : "border-yellow-500"
    } focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200`;
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
            <span className="text-black text-xl font-extrabold">A</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Admin Sign In</h2>
          <p className="text-gray-400 text-sm mt-1">DroneTv Admin Panel</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-5">
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wide" htmlFor="email">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={onLoginChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                placeholder="admin@dronetv.in"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wide" htmlFor="password">
                Password
              </label>
              <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400 transition-colors">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={onLoginChange}
                  className="w-full px-4 py-3 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)} className="px-3 cursor-pointer text-gray-500 hover:text-yellow-400 transition-colors">
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 font-bold text-black bg-yellow-400 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-6">
            Restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}