import { List, Users, FileText, Bell } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import ApplicantStatusChart from "@/components/recruiter/ApplicantStatusChart";
import { dashboardStats } from "@/data/mockData";

const Overview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Listings"
          value={dashboardStats.recruiter.activeListings}
          icon={<List className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Applicants"
          value={dashboardStats.recruiter.totalApplicants}
          icon={<Users className="h-4 w-4" />}
          trend="+15 this week"
        />
        <StatsCard
          title="Shortlisted"
          value={dashboardStats.recruiter.shortlisted}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Interviews"
          value={dashboardStats.recruiter.interviewsScheduled}
          icon={<Bell className="h-4 w-4" />}
          trend="+3 scheduled"
        />
      </div>

      <ApplicantStatusChart />
    </div>
  );
};

export default Overview;
