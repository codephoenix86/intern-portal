import { Progress } from "@/components/ui/progress";

interface ProfileCompletionProps {
  value: number;
}

const ProfileCompletion = ({ value }: ProfileCompletionProps) => {
  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Profile Completion
        </span>
        <span className="text-sm text-primary font-semibold">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
      <p className="text-xs text-muted-foreground mt-2">
        Complete your profile to get better matches
      </p>
    </div>
  );
};

export default ProfileCompletion;
