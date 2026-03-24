import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { getGoogleOAuthUrl } from "@/services/auth.service";
import type { UserRole } from "@/types/auth.types";

interface GoogleAuthButtonProps {
  role?: UserRole;
}

const GoogleAuthButton = ({ role }: GoogleAuthButtonProps) => {
  const handleGoogleLogin = () => {
    window.location.href = getGoogleOAuthUrl(role);
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
      <Chrome className="h-4 w-4 mr-2" />
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton;
