// client/src/components/auth/GoogleAuthButton.tsx

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface GoogleAuthButtonProps {
  onClick?: () => void;
}

const GoogleAuthButton = ({ onClick }: GoogleAuthButtonProps) => {
  return (
    <Button variant="outline" className="w-full" onClick={onClick}>
      <Chrome className="h-4 w-4 mr-2" />
      Google
    </Button>
  );
};

export default GoogleAuthButton;
