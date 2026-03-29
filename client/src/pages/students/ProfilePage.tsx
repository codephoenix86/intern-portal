import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import {
  studentProfileService,
  type StudentProfile,
} from "@/services/studentProfile.service";

const listToCsv = (items: string[]): string => items.join(", ");

const csvToList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const SKILL_SUGGESTIONS = [
  "React",
  "Next.js",
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
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Redux",
  "GraphQL",
  "REST API",
  "Git",
  "Docker",
  "Kubernetes",
  "AWS",
  "Machine Learning",
  "Data Structures",
  "System Design",
];

const normalizeSkill = (value: string): string => value.trim().toLowerCase();

const initialsFromName = (name: string): string => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) {
    return "ST";
  }
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
};

const ProfilePage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [location, setLocation] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [semester, setSemester] = useState("");
  const [experienceSummary, setExperienceSummary] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [projectsCsv, setProjectsCsv] = useState("");
  const [achievementsCsv, setAchievementsCsv] = useState("");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [codechefUrl, setCodechefUrl] = useState("");
  const [codeforcesUrl, setCodeforcesUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const filteredSkillSuggestions = useMemo(() => {
    const query = normalizeSkill(skillInput);
    if (!query) {
      return [];
    }

    const selectedSet = new Set(selectedSkills.map(normalizeSkill));
    return SKILL_SUGGESTIONS
      .filter((skill) =>
        normalizeSkill(skill).includes(query) &&
        !selectedSet.has(normalizeSkill(skill)),
      )
      .slice(0, 8);
  }, [selectedSkills, skillInput]);

  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        const data = await studentProfileService.getProfile();
        setProfile(data);
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
        setAvatar(data.avatar ?? "");
        setBio(data.bio ?? "");
        setCollege(data.college ?? "");
        setBranch(data.branch ?? "");
        setLocation(data.location ?? "");
        setCgpa(data.cgpa ?? "");
        setSemester(data.semester ?? "");
        setExperienceSummary(data.experienceSummary ?? "");
        setSelectedSkills(data.studentSkills ?? []);
        setProjectsCsv(listToCsv(data.studentProjects));
        setAchievementsCsv(listToCsv(data.achievements ?? []));
        setLeetcodeUrl(data.codingProfiles?.leetcode ?? "");
        setCodechefUrl(data.codingProfiles?.codechef ?? "");
        setCodeforcesUrl(data.codingProfiles?.codeforces ?? "");
        setGithubUrl(data.codingProfiles?.github ?? "");
        setLinkedinUrl(data.codingProfiles?.linkedin ?? "");
        setPortfolioUrl(data.codingProfiles?.portfolio ?? "");
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast({
          title: "Profile load failed",
          description: "Unable to fetch your profile right now.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, [toast]);

  const addSkill = (rawSkill: string): void => {
    const trimmed = rawSkill.trim();
    if (!trimmed) {
      return;
    }

    const alreadyExists = selectedSkills.some(
      (skill) => normalizeSkill(skill) === normalizeSkill(trimmed),
    );
    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setSelectedSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string): void => {
    setSelectedSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      const updated = await studentProfileService.updateProfile({
        name,
        phone: phone.trim() ? phone.trim() : null,
        avatar: avatar.trim() ? avatar.trim() : null,
        bio: bio.trim() ? bio.trim() : null,
        college: college.trim() ? college.trim() : null,
        branch: branch.trim() ? branch.trim() : null,
        location: location.trim() ? location.trim() : null,
        cgpa: cgpa.trim() ? cgpa.trim() : null,
        semester: semester.trim() ? semester.trim() : null,
        experienceSummary: experienceSummary.trim()
          ? experienceSummary.trim()
          : null,
        studentSkills: selectedSkills,
        studentProjects: csvToList(projectsCsv),
        achievements: csvToList(achievementsCsv),
        codingProfiles: {
          leetcode: leetcodeUrl.trim() ? leetcodeUrl.trim() : null,
          codechef: codechefUrl.trim() ? codechefUrl.trim() : null,
          codeforces: codeforcesUrl.trim() ? codeforcesUrl.trim() : null,
          github: githubUrl.trim() ? githubUrl.trim() : null,
          linkedin: linkedinUrl.trim() ? linkedinUrl.trim() : null,
          portfolio: portfolioUrl.trim() ? portfolioUrl.trim() : null,
        },
      });

      setProfile(updated);
      toast({
        title: "Profile updated",
        description: "Your student profile has been saved.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update failed",
        description: "Could not save profile changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
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
        description: "Your resume has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Resume upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload resume.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Student Profile</h3>

        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar.trim() || undefined} alt={name || "Student"} />
            <AvatarFallback className="font-semibold">
              {initialsFromName(name || "Student")}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Profile Picture Preview</p>
            <p>Paste an image URL below to update your profile photo.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">Profile Picture URL</label>
            <Input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="mt-1"
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 min-h-24"
              maxLength={500}
              placeholder="Tell recruiters about your interests, strengths, and goals."
            />
            <p className="text-xs text-muted-foreground mt-1">{bio.length}/500</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">College</label>
            <Input value={college} onChange={(e) => setCollege(e.target.value)} className="mt-1" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Branch</label>
            <Input value={branch} onChange={(e) => setBranch(e.target.value)} className="mt-1" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">CGPA</label>
            <Input
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="mt-1"
              placeholder="8.6"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Semester</label>
            <Input
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="mt-1"
              placeholder="6th Semester"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">Experience</label>
            <Textarea
              value={experienceSummary}
              onChange={(e) => setExperienceSummary(e.target.value)}
              className="mt-1 min-h-24"
              placeholder="Describe your internships, freelance work, or project experience."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">Skills</label>

            <div className="mt-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="Type skill like React, Node.js, MongoDB"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addSkill(skillInput)}
                >
                  Add
                </Button>
              </div>

              {filteredSkillSuggestions.length > 0 && (
                <div className="rounded-md border border-border bg-card p-2">
                  <p className="text-xs text-muted-foreground mb-2">Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredSkillSuggestions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedSkills.length > 0 ? (
                  selectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="rounded-sm hover:bg-foreground/10 p-0.5"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">
              Projects (comma separated)
            </label>
            <Input
              value={projectsCsv}
              onChange={(e) => setProjectsCsv(e.target.value)}
              className="mt-1"
              placeholder="Portfolio Website, Internship Tracker"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">
              Achievements (comma separated)
            </label>
            <Input
              value={achievementsCsv}
              onChange={(e) => setAchievementsCsv(e.target.value)}
              className="mt-1"
              placeholder="Top 5 in coding contest, Hackathon finalist"
            />
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-foreground mb-2">Coding Profile Links</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">LeetCode</label>
                <Input
                  value={leetcodeUrl}
                  onChange={(e) => setLeetcodeUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://leetcode.com/username"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">CodeChef</label>
                <Input
                  value={codechefUrl}
                  onChange={(e) => setCodechefUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://www.codechef.com/users/username"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Codeforces</label>
                <Input
                  value={codeforcesUrl}
                  onChange={(e) => setCodeforcesUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://codeforces.com/profile/username"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">GitHub</label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">LinkedIn</label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Portfolio</label>
                <Input
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => void handleSave()} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>

          <label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => void handleResumeUpload(e)}
            />
            <Button type="button" variant="outline" disabled={isUploading} asChild>
              <span>{isUploading ? "Uploading Resume..." : "Upload Resume"}</span>
            </Button>
          </label>

          {profile?.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <Button type="button" variant="outline">View Resume</Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
