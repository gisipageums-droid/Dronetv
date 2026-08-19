import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { useUserAuth } from "./context/context";
import { toast } from "react-toastify";
import * as authService from "../lib/authService";
interface LoginData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  city: string;
  state: string;
  phone: string; // added phone
}

interface PasswordErrors {
  length?: string;
  uppercase?: string;
  lowercase?: string;
  number?: string;
  specialChar?: string;
}

interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

// Google OAuth 2.0 client ID
const GOOGLE_CLIENT_ID = "358541698854-m4h9shq5o4uqg6p5oa2hckr0dbaiive3.apps.googleusercontent.com";

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const [haveAccount, setHaveAccount] = useState<boolean>(true);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    phone: "", // added phone initial value
  });
  //context
  const { login, haveAccount, setHaveAccount } = useUserAuth();

  const navigate = useNavigate();

  // Validate password function
  const validatePassword = (password: string) => {
    const errors: PasswordErrors = {};

    if (password.length < 8) {
      errors.length = "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercase = "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      errors.number = "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.specialChar =
        "Password must contain at least one special character";
    }

    setPasswordErrors(errors);
    setIsPasswordValid(Object.keys(errors).length === 0);
  };

  useEffect(() => {
    if (signUpData.password && signUpData.confirmPassword) {
      setPasswordMatch(signUpData.password === signUpData.confirmPassword);
    }
  }, [signUpData.password, signUpData.confirmPassword]);

  const onLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const onSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      validatePassword(value);
    }

    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const getInputClassName = (
    name: string,
    value: string,
    isError: boolean = false
  ) => {
    const hasError = (touched[name] || formSubmitted) && !value;
    return `w-full p-2 border rounded ${
      hasError || isError ? "border-status-error" : "border-ink-light"
    }`;
  };

  const renderErrorMessage = (name: string, value: string, label: string) => {
    if ((touched[name] || formSubmitted) && !value) {
      return (
        <span className="text-status-error text-xs mt-1 block">
          {label} is required
        </span>
      );
    }
    return null;
  };

  // Handle sign up form submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!isPasswordValid || !passwordMatch) {
      return;
    }

    setIsRegistering(true);
    const { confirmPassword, ...userData } = signUpData;

    try {
      const data = await authService.register(userData);
      toast.success(data.message || "Registration successful! Please login.");
      setHaveAccount(true);
      setSignUpData({
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        city: "",
        state: "",
        phone: "",
      });
      setFormSubmitted(false);
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    try {
      const data = await authService.googleLogin(credentialResponse.credential);
      login(data);
      toast.success("Google login successful!");
      navigate(data?.userData?.role === "company" ? "/company-portal" : "/user-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Google authentication failed");
    }
  };

  const handleGoogleError = () => {};

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await authService.login(loginData);
      login(data);
      setLoginData({ email: "", password: "" });
      navigate(data?.userData?.role === "company" ? "/company-portal" : "/user-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {haveAccount ? (
        // Sign In Modal
        <>
          <div className="relative">
            <div className="absolute top-0 left-0 z-10 w-full h-full bg-ink opacity-50"></div>
            <img
              src="./images/3.jpg"
              className="w-full cover h-42"
              alt="Login"
            />
          </div>
          <div className="absolute top-0 left-0 z-20 flex items-center justify-end w-full h-full px-20">
            <div className="w-full max-w-md px-8 py-5 bg-surface-card rounded-lg shadow-lg">
              <div className="flex items-center justify-between px-5 mb-6">
                <h2 className="pt-5 mb-4 text-2xl font-bold">Sign In</h2>
                <img
                  src="./images/Drone tv .in.png"
                  alt="logo"
                  className="h-[5.5rem] w-[6rem]"
                />
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={onLoginChange}
                    onBlur={handleBlur}
                    className={getInputClassName("email", loginData.email)}
                    placeholder="Enter your email"
                    required
                  />
                  {renderErrorMessage("email", loginData.email, "Email")}
                </div>
                <div className="">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="flex items-center border border-ink-light rounded">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={loginData.password}
                      onChange={onLoginChange}
                      onBlur={handleBlur}
                      className={getInputClassName(
                        "password",
                        loginData.password
                      )}
                      placeholder="Enter your password"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 cursor-pointer"
                    >
                      {showPassword ? (
                        <FaEye className="mx-1 text-status-info" />
                      ) : (
                        <FaEyeSlash className="mx-1 text-status-info" />
                      )}
                    </span>
                  </div>
                  {renderErrorMessage(
                    "password",
                    loginData.password,
                    "Password"
                  )}
                </div>
                <p className="mx-2 mb-4 text-status-info text-end ">
                  <Link
                    className="cursor-pointer hover:font-semibold"
                    to="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </p>
                <button
                  type="submit"
                  className="w-full py-2 text-white bg-status-info rounded hover:bg-status-info"
                >
                  {isLoading ? "Loading..." : "Login"}
                </button>

                {/* Google Sign-In Button */}
                {/* <div className="flex flex-col items-center mt-4">
                  <div className="relative flex justify-center w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-ink-light"></div>
                    </div>
                    <div className="relative px-2 text-sm text-ink-caption bg-surface-card">
                      Or continue with
                    </div>
                  </div>
                  <div className="w-full mt-4">
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        shape="rectangular"
                        size="large"
                        text="continue_with"
                        width="100%"
                      />
                    </GoogleOAuthProvider>
                  </div>
                </div> */}
              </form>
            </div>
          </div>
        </>
      ) : (
        // Sign Up Modal
        <>
          <div className="relative">
            <div className="absolute top-0 left-0 z-10 w-full h-full bg-ink opacity-50"></div>
            <img
              src="./images/3.jpg"
              className="w-full cover h-42"
              alt="Login"
            />
          </div>
          <div className="absolute top-0 left-0 z-20 flex items-center justify-end w-full h-full px-20 mt-10">
            <div className="w-full max-w-md px-8 pb-5 bg-surface-card rounded-lg shadow-lg">
              <div className="flex items-center justify-between px-5 mb-3">
                <h2 className="pt-5 mb-4 text-2xl font-bold">Sign Up</h2>
                <img src="./images/logo.png" alt="logo" className="h-10 w-25" />
              </div>

              <form onSubmit={handleSignUpSubmit}>
                <div className="mb-2">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={signUpData.email}
                    onChange={onSignUpChange}
                    onBlur={handleBlur}
                    className={getInputClassName(
                      "email",
                      signUpData.email
                    ).replace("p-2", "p-1")}
                    placeholder="Enter your email"
                    required
                  />
                  {renderErrorMessage("email", signUpData.email, "Email")}
                </div>
                <div className="mb-2">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={signUpData.fullName}
                    onChange={onSignUpChange}
                    onBlur={handleBlur}
                    className={getInputClassName(
                      "fullName",
                      signUpData.fullName
                    ).replace("p-2", "p-1")}
                    placeholder="Enter your full name"
                    required
                  />
                  {renderErrorMessage(
                    "fullName",
                    signUpData.fullName,
                    "Full Name"
                  )}
                </div>

                {/* NEW: Phone input */}
                <div className="mb-2">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={signUpData.phone}
                    onChange={onSignUpChange}
                    onBlur={handleBlur}
                    className={getInputClassName(
                      "phone",
                      signUpData.phone
                    ).replace("p-2", "p-1")}
                    placeholder="+91XXXXXXXXXX"
                    required
                  />
                  {renderErrorMessage("phone", signUpData.phone, "Phone")}
                </div>

                <div className="mb-2">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="flex items-center border border-ink-light rounded">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={signUpData.password}
                      onChange={onSignUpChange}
                      onBlur={handleBlur}
                      className={getInputClassName(
                        "password",
                        signUpData.password,
                        formSubmitted && !isPasswordValid
                      ).replace("p-2", "p-1")}
                      placeholder="Enter your password"
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 cursor-pointer"
                    >
                      {showPassword ? (
                        <FaEye className="mx-1 text-status-info" />
                      ) : (
                        <FaEyeSlash className="mx-1 text-status-info" />
                      )}
                    </span>
                  </div>
                  {renderErrorMessage(
                    "password",
                    signUpData.password,
                    "Password"
                  )}
                  {formSubmitted && Object.keys(passwordErrors).length > 0 && (
                    <div className="mt-1 text-xs text-status-error">
                      <p>Password must meet the following requirements:</p>
                      <ul className="pl-5 list-disc">
                        {Object.values(passwordErrors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={signUpData.confirmPassword}
                    onChange={onSignUpChange}
                    onBlur={handleBlur}
                    placeholder="Enter your confirm password"
                    className={getInputClassName(
                      "confirmPassword",
                      signUpData.confirmPassword,
                      formSubmitted &&
                        (!passwordMatch || !signUpData.confirmPassword)
                    ).replace("p-2", "p-1")}
                    required
                  />
                  {renderErrorMessage(
                    "confirmPassword",
                    signUpData.confirmPassword,
                    "Confirm Password"
                  )}
                  {formSubmitted && !passwordMatch && (
                    <p className="mt-1 text-xs text-status-error">
                      Passwords do not match
                    </p>
                  )}
                </div>
                <div className="mb-2">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="city"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={signUpData.city}
                    onChange={onSignUpChange}
                    onBlur={handleBlur}
                    className={getInputClassName(
                      "city",
                      signUpData.city
                    ).replace("p-2", "p-1")}
                    placeholder="Enter your city"
                    required
                  />
                  {renderErrorMessage("city", signUpData.city, "City")}
                </div>
                <div className="mb-2">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="state"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={signUpData.state}
                    onChange={onSignUpChange}
                    onBlur={handleBlur}
                    className={getInputClassName(
                      "state",
                      signUpData.state
                    ).replace("p-2", "p-1")}
                    placeholder="Enter your state"
                    required
                  />
                  {renderErrorMessage("state", signUpData.state, "State")}
                </div>
                <button
                  type="submit"
                  className="w-full py-2 text-white bg-status-info rounded hover:bg-status-info disabled:bg-status-info/40"
                  disabled={
                    isRegistering ||
                    (formSubmitted && (!isPasswordValid || !passwordMatch))
                  }
                >
                  {isRegistering ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
              <div className="mt-2">
                <p className="text-sm text-ink-paragraph">
                  Already have an account?{" "}
                  <strong
                    onClick={() => setHaveAccount(true)}
                    className="text-status-info cursor-pointer hover:underline"
                  >
                    Sign in
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
