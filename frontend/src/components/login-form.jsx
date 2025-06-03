import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { signIn, signUp } from "../utils/auth";

export function LoginForm({
  className,
  ...props
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/onboarding';
  
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isForgotPassword) {
        // Simulate password reset request
        // In a real app, you would call a backend API here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setSuccess(`Password reset link sent to ${formData.email}`);
        console.log('Password reset requested for:', formData.email);
      } else if (!isLogin && formData.password !== formData.confirmPassword) {
        setError("Passwords don't match!");
      } else if (isLogin) {
        // Sign in existing user
        const userData = await signIn(formData.email, formData.password);
        console.log('Authentication successful:', userData);
        navigate(redirectTo, { replace: true });
      } else {
        // Sign up new user
        const userData = await signUp(
          formData.email, 
          formData.password, 
          formData.name || formData.email.split('@')[0]
        );
        console.log('Authentication successful:', userData);
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || (isLogin ? 'Failed to sign in' : 'Failed to sign up'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setError(null);
    setSuccess(null);
  };

  const toggleForgotPassword = (e) => {
    e.preventDefault();
    setIsForgotPassword(!isForgotPassword);
    setError(null);
    setSuccess(null);
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {isForgotPassword 
            ? "Reset your password" 
            : isLogin 
              ? "Login to your account" 
              : "Create an account"}
        </h1>
        <p className="text-gray-500 text-sm">
          {isForgotPassword
            ? "Enter your email and we'll send you a link to reset your password"
            : isLogin
              ? "Enter your email below to login to your account"
              : "Enter your details below to create your account"}
        </p>
      </div>
      
      {/* Display error message if present */}
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {/* Display success message if present */}
      {success && (
        <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}
      
      <div className="grid gap-6">
        {!isLogin && !isForgotPassword && (
          <div className="grid gap-3">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
        )}
        
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        
        {!isForgotPassword && (
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <a
                  href="#"
                  className="text-sm text-blue-600 underline-offset-4 hover:underline"
                  onClick={toggleForgotPassword}
                >
                  Forgot your password?
                </a>
              )}
            </div>
            <Input 
              id="password" 
              type="password" 
              required={!isForgotPassword}
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
        )}
        
        {!isLogin && !isForgotPassword && (
          <div className="grid gap-3">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              required 
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
        )}

        {!isLogin && !isForgotPassword && (
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </label>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isForgotPassword ? "Sending reset link..." : isLogin ? "Signing in..." : "Creating account..."}
            </>
          ) : (
            <>{isForgotPassword ? "Send reset link" : isLogin ? "Sign in" : "Create account"}</>
          )}
        </Button>
        
        {isLogin && !isForgotPassword && (
          <>
            <div className="relative text-center text-sm">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
                />
              </svg>
              Login with GitHub
            </Button>
          </>
        )}
      </div>
      <div className="text-center text-sm">
        {isForgotPassword ? (
          <>
            <a 
              href="#" 
              className="text-blue-600 underline underline-offset-4 hover:underline"
              onClick={toggleForgotPassword}
            >
              Back to login
            </a>
          </>
        ) : (
          <>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a 
              href="#" 
              className="text-blue-600 underline underline-offset-4 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                toggleMode();
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </a>
          </>
        )}
      </div>
    </form>
  );
}