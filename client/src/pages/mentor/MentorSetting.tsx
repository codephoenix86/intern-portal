import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/auth/LogoutButton";
import LogoutAllButton from "@/components/auth/LogoutAllButton";

const MentorSettings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-lg space-y-6">
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">
          Mentor Profile Settings
        </h3>

        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <Input defaultValue={user?.name ?? ""} className="mt-1" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <Input defaultValue={user?.email ?? ""} className="mt-1" disabled />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Expertise</label>
          <Input
            defaultValue={user?.expertise?.join(", ") ?? ""}
            className="mt-1"
          />
        </div>

        <Button className="w-full gradient-primary text-primary-foreground border-0">
          Save Changes
        </Button>
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

export default MentorSettings;
