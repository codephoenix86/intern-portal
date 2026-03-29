import { List, Users, FileText, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/StatsCard";
import ApplicantStatusChart from "@/components/recruiter/ApplicantStatusChart";
import { getRecruiterDashboard } from "@/services/recruiterPortal.service";

const Overview = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recruiter", "dashboard"],
    queryFn: getRecruiterDashboard,
  });

  const recruiter = data?.recruiter;
  const breakdown = data?.statusBreakdown ?? [];

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Could not load dashboard statistics.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Listings"
          value={isLoading ? "—" : (recruiter?.activeListings ?? 0)}
          icon={<List className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Applicants"
          value={isLoading ? "—" : (recruiter?.totalApplicants ?? 0)}
          icon={<Users className="h-4 w-4" />}
          trend="+15 this week"
        />
        <StatsCard
          title="Shortlisted"
          value={isLoading ? "—" : (recruiter?.shortlisted ?? 0)}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Interviews"
          value={isLoading ? "—" : (recruiter?.interviewsScheduled ?? 0)}
          icon={<Bell className="h-4 w-4" />}
          trend="+3 scheduled"
        />
      </div>

      <ApplicantStatusChart statusBreakdown={breakdown} />
    </div>
  );
};

export default Overview;
