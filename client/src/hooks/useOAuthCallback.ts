import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useOAuthCallback = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const processed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (processed.current) return;

    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const isNewUser = searchParams.get("isNewUser");

    if (error) {
      processed.current = true;
      toast({
        title: "Authentication Failed",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
      // Clean URL
      setSearchParams({});
      return;
    }

    if (token) {
      processed.current = true;

      // Store token
      localStorage.setItem("accessToken", token);

      // Refresh user data in context
      refreshUser();

      if (isNewUser === "true") {
        toast({
          title: "Welcome! 🎉",
          description: "Your account has been created successfully.",
        });
      } else {
        toast({
          title: "Welcome back! 👋",
          description: "You've been logged in successfully.",
        });
      }

      // Clean URL params
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, refreshUser, toast]);
};
