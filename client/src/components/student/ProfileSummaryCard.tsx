import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StudentProfile } from "@/services/studentProfile.service";

interface ProfileSummaryCardProps {
  profile: StudentProfile;
  matchScore: number;
  improvementText: string;
  onUploadResume: () => void;
  onAddSkills: () => void;
}

const initialsFromName = (name: string): string => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "ST";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

const filenameFromUrl = (url: string): string => {
  const slashIndex = url.lastIndexOf("/");
  if (slashIndex === -1 || slashIndex === url.length - 1) {
    return "resume";
  }
  return decodeURIComponent(url.slice(slashIndex + 1));
};

const formatUpdatedAt = (updatedAt: string): string => {
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const ProfileSummaryCard = ({
  profile,
  matchScore,
  improvementText,
  onUploadResume,
  onAddSkills,
}: ProfileSummaryCardProps) => {
  const checklist = useMemo(
    () => ({
      basicInfo:
        Boolean(profile.name?.trim()) &&
        Boolean(profile.college?.trim()) &&
        Boolean(profile.branch?.trim()) &&
        Boolean(profile.location?.trim()),
      skills: profile.studentSkills.length > 0,
      resume: Boolean(profile.resumeUrl),
      projects: profile.studentProjects.length > 0,
    }),
    [profile],
  );

  const smartTip = useMemo(() => {
    if (!checklist.projects) {
      return "Add projects to increase your match score.";
    }
    if (!checklist.resume) {
      return "Upload your resume to unlock better internship recommendations.";
    }
    if (!checklist.skills) {
      return "Add more skills to improve role-specific matches.";
    }
    return "Great progress. Keep your profile updated for fresher opportunities.";
  }, [checklist]);

  const topSkills = profile.studentSkills.slice(0, 5);

  return (
    <div className="glass-card rounded-lg p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar ?? undefined} alt={profile.name} />
            <AvatarFallback className="text-base font-semibold">
              {initialsFromName(profile.name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{profile.role}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {(profile.college ?? "College not set") +
                (profile.branch ? ` • ${profile.branch}` : "")}
            </p>
            <p className="text-sm text-muted-foreground">{profile.location ?? "Location not set"}</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              {profile.bio?.trim() || "Add a short bio to help recruiters understand your profile."}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm text-muted-foreground">Match Score</p>
          <p className="text-2xl font-bold text-foreground">{matchScore}%</p>
          <p className="text-sm text-emerald-600">{improvementText}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Resume Status</p>
        {profile.resumeUrl ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">{filenameFromUrl(profile.resumeUrl)}</span>
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">View</Button>
            </a>
            <Button variant="outline" size="sm" onClick={onUploadResume}>
              Update
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Not uploaded</span>
            <Button variant="outline" size="sm" onClick={onUploadResume}>
              Upload Resume
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Top Skills</p>
          <Button variant="outline" size="sm" onClick={onAddSkills}>
            + Add Skills
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {topSkills.length > 0 ? (
            topSkills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/profile">
            <Button size="sm">Edit Profile</Button>
          </Link>
          <Button size="sm" variant="outline" onClick={onUploadResume}>
            Upload Resume
          </Button>
          <Link to="/internships">
            <Button size="sm" variant="outline">Find Internships</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Smart Tip</p>
        <p className="text-sm text-muted-foreground">{smartTip}</p>
      </div>

      <p className="text-xs text-muted-foreground">
        Last Updated: {formatUpdatedAt(profile.updatedAt)}
      </p>
    </div>
  );
};

export default ProfileSummaryCard;
