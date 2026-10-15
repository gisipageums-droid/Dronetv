import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { useUserAuth } from "./context/context";
import { toast } from "react-toastify";
import * as authService from "../lib/authService";
import { portalAccess } from "../lib/doctorPortalApi";
interface LoginData {
  email: string;
  password: string;
}

interface OtpAccountOption {
  email: string;
  fullName: string;
  role?: string;
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
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  // Login with OTP (WhatsApp) — self-hosted dev only for now.
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = useState<"phone" | "code">("phone");
  const [otpPhone, setOtpPhone] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [otpSending, setOtpSending] = useState<boolean>(false);
  const [otpVerifying, setOtpVerifying] = useState<boolean>(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState<number>(0);
  const [otpAccounts, setOtpAccounts] = useState<OtpAccountOption[]>([]);
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

  useEffect(() => {
    if (otpResendCooldown <= 0) return;
    const timer = setTimeout(() => setOtpResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpResendCooldown]);

  const resetOtpFlow = () => {
    setOtpStep("phone");
    setOtpPhone("");
    setOtpCode("");
    setOtpAccounts([]);
    setOtpResendCooldown(0);
  };

  const handleSendOtp = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!otpPhone.trim()) return;
    setOtpSending(true);
    try {
      const data = await authService.requestLoginOtp(otpPhone.trim());
      toast.success(data.message || "OTP sent");
      setOtpStep("code");
      setOtpResendCooldown(30);
    } catch (error: any) {
      toast.error(error.message || "Could not send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const completeOtpLogin = async (userId?: string) => {
    setOtpVerifying(true);
    try {
      const result = await authService.verifyLoginOtp(otpPhone.trim(), otpCode.trim(), userId);
      if ("accounts" in result) {
        setOtpAccounts(result.accounts);
        return;
      }
      login(result);
      resetOtpFlow();
      navigate(await landingPath(result));
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 4) return;
    await completeOtpLogin();
  };

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

    if (!agreedToTerms) {
      toast.error("Please accept the Terms of Use and Privacy Policy to continue.");
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

  // A listed Drone Doctor goes straight to the Doctor Portal; everyone else to their usual dashboard.
  const landingPath = async (data: any): Promise<string> => {
    try {
      const access = await portalAccess();
      if (access.doctor) return "/doctor-portal";
    } catch { /* not a doctor, or the check is unavailable */ }
    return data?.userData?.role === "company"
      ? "/company-portal"
      : data?.userData?.role === "professional"
        ? "/professional-portal"
        : "/user-dashboard";
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    try {
      const data = await authService.googleLogin(credentialResponse.credential);
      login(data);
      toast.success("Google login successful!");
      navigate(await landingPath(data));
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
      navigate(await landingPath(data));
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
              <div className="flex gap-4 px-1 mb-4 text-sm font-medium border-b border-ink-light">
                <button
                  type="button"
                  onClick={() => setLoginMethod("password")}
                  className={`pb-2 -mb-px border-b-2 ${
                    loginMethod === "password"
                      ? "border-status-info text-status-info"
                      : "border-transparent text-ink-caption"
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("otp");
                    resetOtpFlow();
                  }}
                  className={`pb-2 -mb-px border-b-2 ${
                    loginMethod === "otp"
                      ? "border-status-info text-status-info"
                      : "border-transparent text-ink-caption"
                  }`}
                >
                  Login with OTP
                </button>
              </div>
              {loginMethod === "otp" ? (
                otpStep === "phone" ? (
                  <form onSubmit={handleSendOtp}>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium" htmlFor="otpPhone">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="otpPhone"
                        name="otpPhone"
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        className="w-full p-2 border rounded border-ink-light"
                        placeholder="Enter your registered phone number"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={otpSending}
                      className="w-full py-2 text-white bg-status-info rounded hover:bg-status-info disabled:opacity-60"
                    >
                      {otpSending ? "Sending..." : "Send OTP"}
                    </button>
                  </form>
                ) : otpAccounts.length > 0 ? (
                  <div>
                    <p className="mb-3 text-sm text-ink-paragraph">
                      We found more than one account for this number. Choose one:
                    </p>
                    {otpAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        disabled={otpVerifying}
                        onClick={() => completeOtpLogin(acc.email)}
                        className="w-full p-3 mb-2 text-left border rounded border-ink-light hover:border-status-info disabled:opacity-60"
                      >
                        <div className="font-medium">{acc.fullName}</div>
                        <div className="text-xs text-ink-caption">
                          {acc.email}
                          {acc.role ? ` · ${acc.role}` : ""}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleVerifyOtp}>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium" htmlFor="otpCode">
                        Enter the 4-digit code sent to {otpPhone}
                      </label>
                      <input
                        type="text"
                        id="otpCode"
                        inputMode="numeric"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full p-2 text-center tracking-[0.5em] border rounded border-ink-light"
                        placeholder="----"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={otpVerifying || otpCode.length !== 4}
                      className="w-full py-2 text-white bg-status-info rounded hover:bg-status-info disabled:opacity-60"
                    >
                      {otpVerifying ? "Verifying..." : "Verify & Login"}
                    </button>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <button
                        type="button"
                        onClick={() => setOtpStep("phone")}
                        className="text-ink-caption hover:underline"
                      >
                        Change number
                      </button>
                      <button
                        type="button"
                        disabled={otpResendCooldown > 0 || otpSending}
                        onClick={handleSendOtp}
                        className="text-status-info hover:underline disabled:text-ink-caption disabled:no-underline"
                      >
                        {otpResendCooldown > 0 ? `Resend in ${otpResendCooldown}s` : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                )
              ) : (
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
              )}
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
                <label className="flex items-start gap-2 mb-3 text-xs text-ink-paragraph cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-status-info hover:underline">Terms of Use</a>
                    {" "}and acknowledge the{" "}
                    <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-status-info hover:underline">Privacy &amp; Cookie Policy</a>.
                  </span>
                </label>
                {formSubmitted && !agreedToTerms && (
                  <p className="mb-2 -mt-1 text-xs text-status-error">
                    You must accept the Terms of Use and Privacy Policy.
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-2 text-white bg-status-info rounded hover:bg-status-info disabled:bg-status-info/40"
                  disabled={
                    isRegistering ||
                    (formSubmitted && (!isPasswordValid || !passwordMatch || !agreedToTerms))
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
