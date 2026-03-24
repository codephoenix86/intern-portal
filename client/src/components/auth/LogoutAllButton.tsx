import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LogoutAllButton = () => {
  const navigate = useNavigate();
  const { logoutAll } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutAll = async () => {
    setIsLoading(true);
    try {
      await logoutAll();
      toast({
        title: "All Sessions Ended",
        description: "You've been logged out from all devices.",
      });
      navigate("/login", { replace: true });
    } catch {
      toast({
        title: "Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <ShieldAlert className="h-4 w-4 mr-2" />
          Logout from All Devices
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout from all devices?</AlertDialogTitle>
          <AlertDialogDescription>
            This will end all your active sessions across every device and
            browser. You will need to log in again everywhere.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogoutAll}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ShieldAlert className="h-4 w-4 mr-2" />
            )}
            Yes, logout everywhere
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAllButton;
