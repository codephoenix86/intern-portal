import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const useOAuthCallback = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const isNewUser = searchParams.get("isNewUser");

    if (error) {
      console.error("OAuth error:", decodeURIComponent(error));
      // Show toast/notification
      // Clean URL
      setSearchParams({});
      return;
    }

    if (token) {
      // Store token in memory/state (not localStorage for security)
      // Your auth context/store should handle this
      console.log("OAuth success, new user:", isNewUser === "true");

      // Clean URL params
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, navigate]);
};
