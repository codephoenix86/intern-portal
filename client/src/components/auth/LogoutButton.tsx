import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

const LogoutButton = ({
  variant = "ghost",
  showIcon = true,
  showText = true,
  className,
}: LogoutButtonProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You've been logged out successfully.",
      });
      navigate("/login", { replace: true });
    } catch {
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && <LogOut className="h-4 w-4" />}
          {showText && <span className={showIcon ? "ml-2" : ""}>Logout</span>}
        </>
      )}
    </Button>
  );
};

export default LogoutButton;
