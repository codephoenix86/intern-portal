import { useState, useEffect } from "react";
import StatsCard from "@/components/StatsCard";
import ProfileCompletion from "@/components/mentor/ProfileCompletion";
import UpcomingClasses from "@/components/mentor/UpcomingClasses";
import TopStudents from "@/components/mentor/TopStudents";
import { Users, BookOpen, Video, ClipboardList, Loader2 } from "lucide-react";
import { getMentorSessions } from "@/services/session.service";
import { useAuth } from "@/contexts/AuthContext";

const MentorHome = () => {
  const { user } = useAuth();

  const [classCount, setClassCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all sessions count
        const allResponse = await getMentorSessions({
          page: 1,
          limit: 1,
          status: "all",
        });
        setClassCount(allResponse.data.total);

        // Fetch upcoming count
        const upcomingResponse = await getMentorSessions({
          page: 1,
          limit: 1,
          status: "upcoming",
        });
        setUpcomingCount(upcomingResponse.data.total);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <ProfileCompletion value={user?.profileCompletion ?? 0} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Students"
          value="—"
          icon={<Users className="h-4 w-4" />}
          trend="Coming soon"
        />
        <StatsCard
          title="Trainings"
          value="—"
          icon={<BookOpen className="h-4 w-4" />}
          trend="Coming soon"
        />
        <StatsCard
          title="Classes"
          value={classCount}
          icon={<Video className="h-4 w-4" />}
          trend={`${upcomingCount} upcoming`}
        />
        <StatsCard
          title="Assignments"
          value="—"
          icon={<ClipboardList className="h-4 w-4" />}
          trend="Coming soon"
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <UpcomingClasses />
        <TopStudents />
      </div>
    </div>
  );
};

export default MentorHome;
