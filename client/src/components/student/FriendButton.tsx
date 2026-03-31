import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, UserX, Clock, Loader2 } from "lucide-react";
import {
  connectionService,
  type FriendStatus,
} from "@/services/connection.service";
import { useToast } from "@/components/ui/use-toast";

interface FriendButtonProps {
  targetUserId: string;
  initialStatus: FriendStatus;
  connectionId?: string;
  onStatusChange?: (newStatus: FriendStatus, connectionId?: string) => void;
}

const FriendButton = ({
  targetUserId,
  initialStatus,
  connectionId: initialConnectionId,
  onStatusChange,
}: FriendButtonProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<FriendStatus>(initialStatus);
  const [connId, setConnId] = useState<string | undefined>(initialConnectionId);
  const [loading, setLoading] = useState(false);

  const updateStatus = (newStatus: FriendStatus, newConnId?: string) => {
    setStatus(newStatus);
    setConnId(newConnId);
    onStatusChange?.(newStatus, newConnId);
  };

  const handleAddFriend = async () => {
    setLoading(true);
    try {
      await connectionService.sendFriendRequest(targetUserId);
      updateStatus("pending_sent");
      toast({ title: "Friend request sent!" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? "Failed to send request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      await connectionService.cancelFriendRequest(targetUserId);
      updateStatus("none");
      toast({ title: "Request cancelled" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? "Failed to cancel",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!connId) return;
    setLoading(true);
    try {
      await connectionService.respondFriendRequest(connId, "accept");
      updateStatus("accepted");
      toast({ title: "Friend request accepted!" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? "Failed to accept",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!connId) return;
    setLoading(true);
    try {
      await connectionService.respondFriendRequest(connId, "reject");
      updateStatus("none");
      toast({ title: "Request rejected" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? "Failed to reject",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    setLoading(true);
    try {
      await connectionService.removeFriend(targetUserId);
      updateStatus("none");
      toast({ title: "Friend removed" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? "Failed to remove",
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

  switch (status) {
    case "none":
      return (
        <Button size="sm" variant="outline" onClick={handleAddFriend}>
          <UserPlus className="h-3 w-3 mr-1" />
          Add Friend
        </Button>
      );
    case "pending_sent":
      return (
        <Button size="sm" variant="secondary" onClick={handleCancelRequest}>
          <Clock className="h-3 w-3 mr-1" />
          Request Sent
        </Button>
      );
    case "pending_received":
      return (
        <div className="flex gap-1">
          <Button size="sm" variant="default" onClick={handleAccept}>
            <UserCheck className="h-3 w-3 mr-1" />
            Accept
          </Button>
          <Button size="sm" variant="outline" onClick={handleReject}>
            <UserX className="h-3 w-3 mr-1" />
            Reject
          </Button>
        </div>
      );
    case "accepted":
      return (
        <Button size="sm" variant="secondary" onClick={handleRemoveFriend}>
          <UserCheck className="h-3 w-3 mr-1" />
          Friends
        </Button>
      );
    default:
      return null;
  }
};

export default FriendButton;
