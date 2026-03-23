// client/src/pages/student/DashboardHome.tsx

import { FileText, Star, Search, TrendingUp } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import ProfileCompletion from "@/components/student/ProfileCompletion";
import ApplicationStatusChart from "@/components/student/ApplicationStatusChart";
import SkillDemandChart from "@/components/student/SkillDemandChart";
import { dashboardStats } from "@/data/mockData";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <ProfileCompletion value={72} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Applications"
          value={dashboardStats.student.applicationsSubmitted}
          icon={<FileText className="h-4 w-4" />}
          trend="+3 this week"
        />
        <StatsCard
          title="Interviews"
          value={dashboardStats.student.interviewsScheduled}
          icon={<Star className="h-4 w-4" />}
          trend="+1 scheduled"
        />
        <StatsCard
          title="Profile Views"
          value={dashboardStats.student.profileViews}
          icon={<Search className="h-4 w-4" />}
          trend="+12 this week"
        />
        <StatsCard
          title="Match Score"
          value={`${dashboardStats.student.matchScore}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="+5% improvement"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ApplicationStatusChart />
        <SkillDemandChart />
      </div>
    </div>
  );
};

export default DashboardHome;
