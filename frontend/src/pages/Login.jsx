import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "../components/login-form";
import { checkAuth } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract redirect destination from location state or default to '/onboarding'
  const redirectTo = location.state?.from?.pathname || '/onboarding';

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
          navigate(redirectTo, { replace: true });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    
    verifyAuth();
  }, [navigate, redirectTo]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-blue-600 text-white flex h-6 w-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="h-4 w-4" />
            </div>
            UBOS Agentspace
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 relative hidden lg:block">
        <img
          src="https://ubos.tech/wp-content/uploads/2024/02/ubos-open-source.webp"
          alt="Login Illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          
        />
      </div>
    </div>
  );
}
