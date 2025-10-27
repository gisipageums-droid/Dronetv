import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import {useUserAuth}  from "./context/context";
 import { toast } from 'react-toastify';
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
const GOOGLE_CLIENT_ID = "";

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const [haveAccount, setHaveAccount] = useState<boolean>(true);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' }); 
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    phone: '' // added phone initial value
  });
  //context
  const {login,haveAccount, setHaveAccount } = useUserAuth();

   const navigate = useNavigate();

   // Validate password function
  const validatePassword = (password: string) => {
    const errors: PasswordErrors = {};
    
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      errors.number = 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.specialChar = 'Password must contain at least one special character';
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
      [name]: value
    });
  };


  const onSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'password') {
      validatePassword(value);
    }
    
    setSignUpData({
      ...signUpData,
      [name]: value
    });
  };

  // Handle sign up form submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!isPasswordValid || !passwordMatch) {
      return;
    }
    
    const { confirmPassword, ...userData } = signUpData; // phone included in userData now
    console.log('Sign up successful with data:', userData);
    
    try {
      const response = await fetch("https://rnpcnionle.execute-api.ap-south-1.amazonaws.com/user_register_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        toast(data.message)
        setHaveAccount(true); // Switch to login view after successful registration
      } else {
        toast.error('Failed to register user:', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }

    setSignUpData({
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      city: '',
      state: '',
      phone: '' // reset phone
    });
  };

//handle google sign in-
 const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GoogleUser>(credentialResponse.credential); 
      console.log('Google login successful:', decoded);
      
      try {
        // Send Google credential to your backend for verification
        const response = await fetch("https://67duf9ey84.execute-api.ap-south-1.amazonaws.com/google_log/Google_login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token: credentialResponse.credential })
        });

        if (response.ok) {
          const data = await response.json();
          login(data); // Store user data
          toast('Google login successful!');
          // alert('Google login successful!');
          navigate("/user-companies"); // Navigate to dashboard
        } else {
          toast.error('Google authentication failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during Google authentication:', error);
      }
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  // Handle login form submission
   const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    
    try {
      const response = await fetch("https://yxzlfcqwf7.execute-api.ap-south-1.amazonaws.com/prod/login_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
           toast.success(data.message);
        // console.log('API response:', data);
        
        // Store user data in context and localStorage
        login(data);
        
        setLoginData({ 
          email: '',
          password: ''
        });

        navigate("/user-companies") // Navigate to dashboard
      } else {
        setIsLoading(false);
        toast.error(data.message);
        // console.error( response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <>
      {haveAccount ? (
        // Sign In Modal
        <>
          <div className='relative'>
            <div className='absolute top-0 left-0 z-10 w-full h-full bg-black opacity-50'></div>
            <img src="./images/3.jpg" className='w-full cover h-42' alt="Login" />
          </div>
          <div className='absolute top-0 left-0 z-20 flex items-center justify-end w-full h-full px-20'>
            <div className='w-full max-w-md px-8 py-5 bg-white rounded-lg shadow-lg'>
              <div className='flex items-center justify-between px-5 mb-6'>
                <h2 className='pt-5 mb-4 text-2xl font-bold'>Sign In</h2>
                <img src="./images/Drone tv .in.png" alt="logo" className='h-[5.5rem] w-[6rem]'/>
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className='mb-4'>
                  <label className='block mb-2 text-sm font-medium' htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={loginData.email} 
                    onChange={onLoginChange} 
                    className='w-full p-2 border border-gray-300 rounded' 
                    required 
                  />
                </div>
                <div className=''>
                  <label className='block mb-2 text-sm font-medium' htmlFor="password">Password</label>
                  <div className='flex items-center border border-gray-300 rounded'>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      name="password" 
                      value={loginData.password} 
                      onChange={onLoginChange} 
                      className='w-full p-2 border-gray-300 rounded' 
                      required 
                    />
                    <span 
                      onClick={() => setShowPassword(!showPassword)} 
                      className='p-2 cursor-pointer'
                    >
                      {showPassword ? <FaEye className='mx-1 text-blue-500' /> : <FaEyeSlash className='mx-1 text-blue-500' />}
                    </span>
                  </div>
                </div>
                <p className='mx-2 mb-4 text-blue-700 text-end '>
                  <Link className='cursor-pointer hover:font-semibold' to="/forgot-password">
                    Forgot Password?
                  </Link>
                </p>
                <button 
                  type="submit" 
                  className='w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600'
                >
                  {isLoading ? "Loading..." : "Login"}
                </button>

                {/* Google Sign-In Button */}
                <div className="flex flex-col items-center mt-4">
                  <div className="relative flex justify-center w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative px-2 text-sm text-gray-500 bg-white">
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
                </div>
              </form>
              <div className='mt-4'>
                <p className='text-sm text-gray-600'>
                  Don't have an account?{' '}
                  <strong 
                    onClick={() => setHaveAccount(false)} 
                    className='text-blue-500 cursor-pointer hover:underline'
                  >
                    Sign up
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Sign Up Modal
        <>
          <div className='relative'>
            <div className='absolute top-0 left-0 z-10 w-full h-full bg-black opacity-50'></div>
            <img src="./images/3.jpg" className='w-full cover h-42' alt="Login" />
          </div>
          <div className='absolute top-0 left-0 z-20 flex items-center justify-end w-full h-full px-20 mt-10'>
            <div className='w-full max-w-md px-8 pb-5 bg-white rounded-lg shadow-lg'>
              <div className='flex items-center justify-between px-5 mb-3'>
                <h2 className='pt-5 mb-4 text-2xl font-bold'>Sign Up</h2>
                <img src="./images/logo.png" alt="logo" className='h-10 w-25'/>
              </div>

              <form onSubmit={handleSignUpSubmit}>
                <div className='mb-2'>
                  <label className='block mb-2 text-sm font-medium' htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={signUpData.email} 
                    onChange={onSignUpChange} 
                    className='w-full p-1 border border-gray-300 rounded' 
                    required 
                  />
                </div>
                <div className='mb-2'>
                  <label className='block mb-2 text-sm font-medium' htmlFor="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    value={signUpData.fullName} 
                    onChange={onSignUpChange} 
                    className='w-full p-1 border border-gray-300 rounded' 
                    required 
                  />
                </div>

                {/* NEW: Phone input */}
                <div className='mb-2'>
                  <label className='block mb-2 text-sm font-medium' htmlFor="phone">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={signUpData.phone} 
                    onChange={onSignUpChange} 
                    className='w-full p-1 border border-gray-300 rounded' 
                    placeholder="+91XXXXXXXXXX"
                    required 
                  />
                </div>

                <div className='mb-2'>
                  <label className='block mb-2 text-sm font-medium' htmlFor="password">Password</label>
                  <div className='flex items-center border border-gray-300 rounded'>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      name="password" 
                      value={signUpData.password} 
                      onChange={onSignUpChange} 
                      className={`w-full p-1 border-gray-300 rounded ${formSubmitted && !isPasswordValid ? 'border-red-500' : ''}`} 
                      required 
                    />
                    <span 
                      onClick={() => setShowPassword(!showPassword)} 
                      className='p-2 cursor-pointer'
                    >
                      {showPassword ? <FaEye className='mx-1 text-blue-500' /> : <FaEyeSlash className='mx-1 text-blue-500' />}
                    </span>
                  </div>
                  {formSubmitted && Object.keys(passwordErrors).length > 0 && (
                    <div className="mt-1 text-xs text-red-500">
                      <p>Password must meet the following requirements:</p>
                      <ul className="pl-5 list-disc">
                        {Object.values(passwordErrors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className='mb-2'>
                  <label className='block mb-2 text-sm font-medium' htmlFor="confirmPassword">Confirm Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={signUpData.confirmPassword} 
                    onChange={onSignUpChange} 
                    className={`w-full p-1 border ${formSubmitted && (!passwordMatch || !signUpData.confirmPassword) ? 'border-red-500' : 'border-gray-300'} rounded`} 
                    required 
                  />
                  {formSubmitted && !passwordMatch && (
                    <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
                <div className='mb-2'>
                  <label className='block mb-2 text-sm font-medium' htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={signUpData.city} 
                    onChange={onSignUpChange} 
                    className='w-full p-1 border border-gray-300 rounded' 
                    required 
                  />
                </div>
                <div className='mb-2'>
                  <label className='block mb-2 text-sm font-medium' htmlFor="state">State</label>
                  <input 
                    type="text" 
                    id="state" 
                    name="state" 
                    value={signUpData.state} 
                    onChange={onSignUpChange} 
                    className='w-full p-1 border border-gray-300 rounded' 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className='w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300'
                  disabled={formSubmitted && (!isPasswordValid || !passwordMatch)}
                >
                  Sign Up
                </button>
              </form>
              <div className='mt-2'>
                <p className='text-sm text-gray-600'>
                  Already have an account?{' '}
                  <strong 
                    onClick={() => setHaveAccount(true)} 
                    className='text-blue-500 cursor-pointer hover:underline'
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
