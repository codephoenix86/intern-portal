import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RecruiterSettings = () => {
  return (
    <div className="max-w-lg space-y-4">
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Company Settings</h3>

        <div>
          <Label>Company Name</Label>
          <Input defaultValue="TechCorp" className="mt-1" />
        </div>

        <div>
          <Label>Contact Email</Label>
          <Input defaultValue="hr@techcorp.com" className="mt-1" />
        </div>

        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default RecruiterSettings;
