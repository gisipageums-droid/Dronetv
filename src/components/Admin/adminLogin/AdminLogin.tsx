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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md px-8 py-8 bg-white rounded-2xl shadow-lg border border-yellow-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Admin Sign In</h2>
          <p className="text-gray-600 text-sm mt-2">Access the admin dashboard</p>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={onLoginChange}
              className={getInputClassName(loginData.email)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded focus-within:border-yellow-500 focus-within:ring-2 focus-within:ring-yellow-200">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={loginData.password}
                onChange={onLoginChange}
                className="w-full p-2 border-none focus:ring-0 outline-none"
                placeholder="Enter your password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 cursor-pointer text-gray-500 hover:text-yellow-600"
              >
                {showPassword ? (
                  <FaEye className="mx-1" />
                ) : (
                  <FaEyeSlash className="mx-1" />
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-200 font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800 text-center">
            <strong>Note:</strong> This area is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}