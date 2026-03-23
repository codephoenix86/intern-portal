import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MentorSettings = () => {
  return (
    <div className="max-w-lg space-y-4">
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">
          Mentor Profile Settings
        </h3>

        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <Input defaultValue="Mentor Name" className="mt-1" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <Input defaultValue="mentor@email.com" className="mt-1" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Expertise</label>
          <Input defaultValue="DSA, Web Dev, ML" className="mt-1" />
        </div>

        <Button className="w-full gradient-primary text-primary-foreground border-0">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default MentorSettings;
