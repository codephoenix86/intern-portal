import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/auth/LogoutButton";
import LogoutAllButton from "@/components/auth/LogoutAllButton";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-lg space-y-6">
      {/* Profile Settings */}
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Profile Settings</h3>

        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <Input defaultValue={user?.name ?? ""} className="mt-1" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <Input defaultValue={user?.email ?? ""} className="mt-1" disabled />
          {user?.provider !== "local" && (
            <p className="text-xs text-muted-foreground mt-1">
              Connected via {user?.provider}
            </p>
          )}
        </div>

        <Button>Save Changes</Button>
      </div>

      {/* Session Management */}
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Session Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your active login sessions across devices.
        </p>

        <LogoutButton variant="outline" className="w-full" showIcon showText />

        <LogoutAllButton />
      </div>
    </div>
  );
};

export default SettingsPage;
