// client/src/components/auth/GoogleAuthButton.tsx

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface GoogleAuthButtonProps {
  role?: "student" | "mentor" | "recruiter";
}

const GoogleAuthButton = ({ role }: GoogleAuthButtonProps) => {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const roleParam = role ? `?role=${role}` : "";
    window.location.href = `${baseUrl}/api/auth/google${roleParam}`;
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
      <Chrome className="h-4 w-4 mr-2" />
      Google
    </Button>
  );
};

export default GoogleAuthButton;
