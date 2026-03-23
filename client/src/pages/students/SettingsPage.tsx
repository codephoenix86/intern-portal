// client/src/pages/student/SettingsPage.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SettingsPage = () => {
  return (
    <div className="max-w-lg space-y-4">
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Profile Settings</h3>

        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <Input defaultValue="Aarav Sharma" className="mt-1" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <Input defaultValue="aarav@email.com" className="mt-1" />
        </div>

        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
