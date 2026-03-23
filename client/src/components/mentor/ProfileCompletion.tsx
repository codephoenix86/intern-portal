import { Progress } from "@/components/ui/progress";

interface ProfileCompletionProps {
  value: number;
}

const ProfileCompletion = ({ value }: ProfileCompletionProps) => {
  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">
          Mentor Profile Completion
        </span>
        <span className="text-sm text-primary font-semibold">{value}%</span>
      </div>

      <Progress value={value} className="h-2" />

      <p className="text-xs text-muted-foreground mt-2">
        Complete your mentor profile to get more student requests.
      </p>
    </div>
  );
};

export default ProfileCompletion;
