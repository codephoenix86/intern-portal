// client/src/pages/student/DashboardHome.tsx

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText, Search, Star, TrendingUp } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import ProfileCompletion from "@/components/student/ProfileCompletion";
import ProfileSummaryCard from "@/components/student/ProfileSummaryCard";
import SkillDemandChart, {
  type SkillDemandPoint,
} from "@/components/student/SkillDemandChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  studentProfileService,
  type StudentApplication,
  type StudentDashboardStats,
  type StudentProfile,
} from "@/services/studentProfile.service";
import { useToast } from "@/hooks/use-toast";

const STATUS_COLORS: Record<string, string> = {
  Applied: "hsl(217, 71%, 53%)",
  Screening: "hsl(35, 92%, 56%)",
  Interview: "hsl(162, 72%, 40%)",
  Offer: "hsl(162, 72%, 30%)",
  Rejected: "hsl(0, 72%, 51%)",
};

interface ApplicationStatusPoint {
  name: string;
  value: number;
  color: string;
}

const statusOrder = ["Applied", "Screening", "Interview", "Offer", "Rejected"];

const knownSkills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Python",
  "Java",
  "C++",
  "SQL",
  "HTML",
  "CSS",
  "Tailwind",
  "Redux",
  "Next.js",
  "GraphQL",
  "Docker",
  "AWS",
  "Figma",
  "MERN",
  "AI/ML",
];

const asDate = (value: string): Date => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
};

const countWithinDays = (items: StudentApplication[], days: number): number => {
  const now = Date.now();
  const ms = days * 24 * 60 * 60 * 1000;
  return items.filter((item) => now - asDate(item.date).getTime() <= ms).length;
};

const buildStatusData = (applications: StudentApplication[]): ApplicationStatusPoint[] => {
  const counts = new Map<string, number>();
  for (const app of applications) {
    counts.set(app.status, (counts.get(app.status) ?? 0) + 1);
  }

  return statusOrder.map((status) => ({
    name: status,
    value: counts.get(status) ?? 0,
    color: STATUS_COLORS[status],
  }));
};

const addCount = (target: Map<string, number>, skill: string): void => {
  const normalized = skill.trim();
  if (!normalized) return;
  target.set(normalized, (target.get(normalized) ?? 0) + 1);
};

const splitSkillText = (text: string): string[] =>
  text
    .split(/[,/|+&]/g)
    .map((part) => part.trim())
    .filter(Boolean);

const extractResumeSkills = (parsedResume: Record<string, unknown> | null): string[] => {
  if (!parsedResume) return [];

  const skills: string[] = [];

  const rawSkills = parsedResume["skills"];
  if (Array.isArray(rawSkills)) {
    for (const item of rawSkills) {
      if (typeof item === "string") {
        skills.push(item);
      }
    }
  }

  const rawProjects = parsedResume["projects"];
  if (Array.isArray(rawProjects)) {
    for (const project of rawProjects) {
      if (project && typeof project === "object") {
        const tech = (project as Record<string, unknown>)["tech"];
        if (typeof tech === "string") {
          skills.push(...splitSkillText(tech));
        }
      }
    }
  }

  return skills;
};

const inferSkillsFromProjectText = (projects: string[]): string[] => {
  const inferred: string[] = [];

  for (const project of projects) {
    const lower = project.toLowerCase();
    for (const skill of knownSkills) {
      if (lower.includes(skill.toLowerCase())) {
        inferred.push(skill);
      }
    }
  }

  return inferred;
};

const buildPersonalSkillUsage = (profile: StudentProfile): SkillDemandPoint[] => {
  const counter = new Map<string, number>();
  const resumeSkills = extractResumeSkills(profile.parsedResume);
  const inferredFromProjects = inferSkillsFromProjectText(profile.studentProjects);

  for (const skill of resumeSkills) {
    addCount(counter, skill);
  }

  for (const skill of inferredFromProjects) {
    addCount(counter, skill);
  }

  // Fallback to saved profile skills if resume/project parsing yields no signal.
  if (counter.size === 0) {
    for (const skill of profile.studentSkills) {
      addCount(counter, skill);
    }
  }

  const map = new Map<string, number>();
  for (const [skill, count] of counter.entries()) {
    map.set(skill, count);
  }

  return [...map.entries()]
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
};

const DashboardHome = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [trendingSkills, setTrendingSkills] = useState<string[]>([]);

  useEffect(() => {
    const loadDashboardData = async (): Promise<void> => {
      try {
        const [profileData, statsData, appList] = await Promise.all([
          studentProfileService.getProfile(),
          studentProfileService.getDashboardStats(),
          studentProfileService.getApplications(),
        ]);
        const personalSkillData = buildPersonalSkillUsage(profileData);

        setProfile(profileData);
        setStats(statsData);
        setApplications(appList);
        setTrendingSkills(personalSkillData.slice(0, 3).map((x) => x.skill));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Dashboard load failed",
          description: "Could not load profile details right now.",
          variant: "destructive",
        });
      }
    };

    void loadDashboardData();
  }, [toast]);

  const handleUploadResume = (): void => {
    fileInputRef.current?.click();
  };

  const onResumeSelected = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const result = await studentProfileService.uploadResume(file);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              resumeUrl: result.url,
            }
          : prev,
      );
      toast({
        title: "Resume uploaded",
        description: "Your profile has been updated with latest resume.",
      });
    } catch (error) {
      console.error("Resume upload failed:", error);
      toast({
        title: "Resume upload failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
    }
  };

  if (!profile || !stats) {
    return <p className="text-sm text-muted-foreground">Loading dashboard...</p>;
  }

  const thisWeekApplications = countWithinDays(applications, 7);
  const portfolioLinksCount = Object.values(profile.codingProfiles).filter(Boolean).length;
  const statusSummary = buildStatusData(applications);
  const topSkillUsage = buildPersonalSkillUsage(profile);
  const sortedRecentApplications = [...applications]
    .sort((a, b) => asDate(b.date).getTime() - asDate(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => void onResumeSelected(e)}
      />

      <ProfileSummaryCard
        profile={profile}
        matchScore={stats.student.matchScore}
        improvementText={`${thisWeekApplications} application${thisWeekApplications === 1 ? "" : "s"} this week`}
        onUploadResume={handleUploadResume}
        onAddSkills={() => navigate("/profile")}
      />

      <ProfileCompletion value={profile.profileCompletion} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Applications"
          value={stats.student.applicationsSubmitted}
          icon={<FileText className="h-4 w-4" />}
          trend={`${thisWeekApplications} this week`}
        />
        <StatsCard
          title="Interviews"
          value={stats.student.interviewsScheduled}
          icon={<Star className="h-4 w-4" />}
          trend={`${applications.filter((a) => a.status === "Interview").length} in pipeline`}
        />
        <StatsCard
          title="Profile Views"
          value={stats.student.profileViews}
          icon={<Search className="h-4 w-4" />}
          trend="Total recruiter views"
        />
        <StatsCard
          title="Match Score"
          value={`${stats.student.matchScore}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="Average across applications"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="glass-card rounded-lg p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Application Progress</h3>
          <div className="space-y-2">
            {statusSummary.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-md border border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SkillDemandChart data={topSkillUsage} />
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="glass-card rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Applications</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/applications")}
            >
              View all
            </Button>
          </div>
          {sortedRecentApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications yet. Start applying to track your progress here.
            </p>
          ) : (
            <div className="space-y-3">
              {sortedRecentApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-md border border-border p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{application.internship}</p>
                    <p className="text-xs text-muted-foreground">{application.company}</p>
                  </div>
                  <Badge variant="secondary">{application.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-card rounded-lg p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Portfolio Highlights</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">CGPA</p>
              <p className="text-lg font-semibold text-foreground">{profile.cgpa ?? "Not set"}</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">Semester</p>
              <p className="text-lg font-semibold text-foreground">{profile.semester ?? "Not set"}</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">Projects</p>
              <p className="text-lg font-semibold text-foreground">{profile.studentProjects.length}</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">Coding Profiles</p>
              <p className="text-lg font-semibold text-foreground">{portfolioLinksCount}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Most Used Skills</p>
            <div className="flex flex-wrap gap-2">
              {trendingSkills.length > 0 ? (
                trendingSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    <Briefcase className="mr-1 h-3 w-3" />
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Add project tech stack or upload resume to see your skills graph.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHome;
