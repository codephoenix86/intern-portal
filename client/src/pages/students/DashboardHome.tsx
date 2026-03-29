import { FileText, Star, Search, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/StatsCard";
import ProfileCompletion from "@/components/student/ProfileCompletion";
import ApplicationStatusChart from "@/components/student/ApplicationStatusChart";
import SkillDemandChart from "@/components/student/SkillDemandChart";
import { PIE_DATA } from "@/constants/student.constants";
import {
  getStudentDashboard,
  listStudentApplications,
  getStudentProfile,
} from "@/services/studentPortal.service";

const STATUS_ORDER = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
] as const;

function buildApplicationPie(
  applications: { status: string }[],
): { name: string; value: number; color: string }[] {
  const counts: Record<string, number> = Object.fromEntries(
    STATUS_ORDER.map((s) => [s, 0]),
  );
  for (const a of applications) {
    if (counts[a.status] !== undefined) counts[a.status]++;
  }
  return STATUS_ORDER.map((name, i) => ({
    name,
    value: counts[name],
    color: PIE_DATA[i].color,
  })).filter((d) => d.value > 0);
}

const DashboardHome = () => {
  const { data: dash, isLoading: dashLoading } = useQuery({
    queryKey: ["student", "dashboard"],
    queryFn: getStudentDashboard,
  });

  const { data: appsData } = useQuery({
    queryKey: ["student", "applications"],
    queryFn: listStudentApplications,
  });

  const { data: profile } = useQuery({
    queryKey: ["student", "profile"],
    queryFn: getStudentProfile,
  });

  const pieData = useMemo(
    () => buildApplicationPie(appsData?.applications ?? []),
    [appsData?.applications],
  );

  const student = dash?.student;

  return (
    <div className="space-y-6">
      <ProfileCompletion value={profile?.profileCompletion ?? 0} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Applications"
          value={dashLoading ? "—" : (student?.applicationsSubmitted ?? 0)}
          icon={<FileText className="h-4 w-4" />}
          trend="+3 this week"
        />
        <StatsCard
          title="Interviews"
          value={dashLoading ? "—" : (student?.interviewsScheduled ?? 0)}
          icon={<Star className="h-4 w-4" />}
          trend="+1 scheduled"
        />
        <StatsCard
          title="Profile Views"
          value={dashLoading ? "—" : (student?.profileViews ?? 0)}
          icon={<Search className="h-4 w-4" />}
          trend="+12 this week"
        />
        <StatsCard
          title="Match Score"
          value={
            dashLoading ? "—" : `${student?.matchScore ?? 0}%`
          }
          icon={<TrendingUp className="h-4 w-4" />}
          trend="+5% improvement"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ApplicationStatusChart data={pieData} />
        <SkillDemandChart />
      </div>
    </div>
  );
};

export default DashboardHome;
