import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/auth/LogoutButton";
import LogoutAllButton from "@/components/auth/LogoutAllButton";

const RecruiterSettings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-lg space-y-6">
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Company Settings</h3>

        <div>
          <Label>Company Name</Label>
          <Input defaultValue={user?.companyName ?? ""} className="mt-1" />
        </div>

        <div>
          <Label>Contact Email</Label>
          <Input
            defaultValue={user?.companyEmail ?? user?.email ?? ""}
            className="mt-1"
          />
        </div>

        <Button>Save Changes</Button>
      </div>

      {/* Session Management */}
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Session Management</h3>

        <LogoutButton variant="outline" className="w-full" />
        <LogoutAllButton />
      </div>
    </div>
  );
};

export default RecruiterSettings;
