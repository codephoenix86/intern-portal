// client/src/pages/mentor/MentorHome.tsx

import StatsCard from "@/components/StatsCard";
import ProfileCompletion from "@/components/mentor/ProfileCompletion";
import UpcomingClasses from "@/components/mentor/UpcomingClasses";
import TopStudents from "@/components/mentor/TopStudents";
import { UsersRound, Dumbbell, MonitorPlay, NotebookTabs } from "lucide-react";

const MentorHome = () => {
  return (
    <div className="space-y-8">
      {/* Profile Completion */}
      <ProfileCompletion value={80} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Students"
          value="42"
          icon={<UsersRound className="h-4 w-4 stroke-[1.65]" />}
          trend="+5 this week"
        />
        <StatsCard
          title="Trainings"
          value="12"
          icon={<Dumbbell className="h-4 w-4 stroke-[1.65]" />}
          trend="+2 new"
        />
        <StatsCard
          title="Classes"
          value="6"
          icon={<MonitorPlay className="h-4 w-4 stroke-[1.65]" />}
          trend="3 upcoming"
        />
        <StatsCard
          title="Assignments"
          value="18"
          icon={<NotebookTabs className="h-4 w-4 stroke-[1.65]" />}
          trend="pending review"
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
