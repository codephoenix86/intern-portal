import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { connectionService } from "@/services/connection.service";
import { useToast } from "@/components/ui/use-toast";

interface FollowButtonProps {
  targetUserId: string;
  initialFollowing: boolean;
  onStatusChange?: (following: boolean) => void;
}

const FollowButton = ({
  targetUserId,
  initialFollowing,
  onStatusChange,
}: FollowButtonProps) => {
  const { toast } = useToast();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (following) {
        await connectionService.unfollowUser(targetUserId);
        setFollowing(false);
        onStatusChange?.(false);
        toast({ title: "Unfollowed" });
      } else {
        await connectionService.followUser(targetUserId);
        setFollowing(true);
        onStatusChange?.(true);
        toast({ title: "Following!" });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? "Action failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
        ...
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant={following ? "secondary" : "outline"}
      onClick={handleToggle}
    >
      {following ? (
        <>
          <UserCheck className="h-3 w-3 mr-1" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-3 w-3 mr-1" />
          Follow
        </>
      )}
    </Button>
  );
};

export default FollowButton;
