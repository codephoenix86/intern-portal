import { LayoutList, UserSearch, ClipboardCheck, CalendarClock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StatsCard from "@/components/StatsCard";
import ApplicantStatusChart from "@/components/recruiter/ApplicantStatusChart";
import { recruiterPortalService } from "@/services/recruiterPortal.service";
import type { StatusPieItem } from "@/types/recruiter.types";
import { STATUS_PIE_DATA } from "@/constants/recruiter.constants";

const Overview = () => {
  const [stats, setStats] = useState<{
    activeListings: number;
    totalApplicants: number;
    shortlisted: number;
    interviewsScheduled: number;
  } | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const data = await recruiterPortalService.getDashboard();
        setStats(data.recruiter);
        setStatusBreakdown(data.statusBreakdown ?? []);
      } catch (e) {
        console.error("Failed to load recruiter dashboard:", e);
        setStats(null);
        setStatusBreakdown([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const chartData: StatusPieItem[] = useMemo(() => {
    if (!statusBreakdown || statusBreakdown.length === 0) return STATUS_PIE_DATA;
    const colorByName = new Map(STATUS_PIE_DATA.map((d) => [d.name, d.color]));
    return statusBreakdown.map((d) => ({
      name: d.name,
      value: d.value,
      color: colorByName.get(d.name) ?? "hsl(var(--muted-foreground))",
    }));
  }, [statusBreakdown]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Listings"
          value={isLoading ? "…" : (stats?.activeListings ?? 0)}
          icon={<LayoutList className="h-4 w-4 stroke-[1.65]" />}
        />
        <StatsCard
          title="Total Applicants"
          value={isLoading ? "…" : (stats?.totalApplicants ?? 0)}
          icon={<UserSearch className="h-4 w-4 stroke-[1.65]" />}
          trend="+15 this week"
        />
        <StatsCard
          title="Shortlisted"
          value={isLoading ? "…" : (stats?.shortlisted ?? 0)}
          icon={<ClipboardCheck className="h-4 w-4 stroke-[1.65]" />}
        />
        <StatsCard
          title="Interviews"
          value={isLoading ? "…" : (stats?.interviewsScheduled ?? 0)}
          icon={<CalendarClock className="h-4 w-4 stroke-[1.65]" />}
          trend="+3 scheduled"
        />
      </div>

      {isLoading ? (
        <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
      ) : (
        <ApplicantStatusChart data={chartData} />
      )}
    </div>
  );
};

export default Overview;
