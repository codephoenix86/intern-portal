import { useCallback, useEffect, useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import SkillTag from "@/components/SkillTag";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  studentProfileService,
  type StudentProfile,
} from "@/services/studentProfile.service";

const strField = (
  obj: Record<string, unknown> | null,
  key: string,
): string | null => {
  const v = obj?.[key];
  return typeof v === "string" ? v : null;
};

const firstEducationDegree = (
  obj: Record<string, unknown> | null,
): string | null => {
  const ed = obj?.["education"];
  if (!Array.isArray(ed) || ed.length === 0) {
    return null;
  }
  const first = ed[0];
  if (first && typeof first === "object" && first !== null) {
    const d = (first as Record<string, unknown>)["degree"];
    return typeof d === "string" ? d : null;
  }
  return null;
};

const skillsList = (obj: Record<string, unknown> | null): string[] => {
  const raw = obj?.["skills"];
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter((x): x is string => typeof x === "string");
};

const ResumePage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        const data = await studentProfileService.getProfile();
        setProfile(data);
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

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await studentProfileService.uploadResume(file);
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                resumeUrl: result.url,
                parsedResume: result.parsedResume,
              }
            : prev,
        );
        setUploadKey((k) => k + 1);
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
      }
    },
    [toast],
  );

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  const parsed = profile?.parsedResume ?? null;
  const name = strField(parsed, "name");
  const email = strField(parsed, "email");
  const phone = strField(parsed, "phone");
  const degree = firstEducationDegree(parsed);
  const skills = skillsList(parsed);
  const note = strField(parsed, "_note");

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Upload resume</h3>
        <ResumeUpload
          key={uploadKey}
          onUpload={(f) => void handleUpload(f)}
          disabled={isUploading}
        />
        {profile?.resumeUrl ? (
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
            <Button type="button" variant="outline">
              View Resume
            </Button>
          </a>
        ) : null}
      </div>

      <div className="glass-card rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-4">
          Parsed Resume Data
        </h3>

        {!parsed ? (
          <p className="text-sm text-muted-foreground">
            Upload a resume to see parsed fields here. Parsed data comes from your
            saved profile after upload.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground ml-2">
                  {name ?? "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-foreground ml-2">
                  {email ?? "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium text-foreground ml-2">
                  {phone ?? "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Education:</span>
                <span className="font-medium text-foreground ml-2">
                  {degree ?? "—"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-sm text-muted-foreground">Skills:</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.length > 0 ? (
                  skills.map((s) => <SkillTag key={s} skill={s} />)
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No skills in parsed data yet.
                  </span>
                )}
              </div>
            </div>

            {note ? (
              <p className="text-xs text-muted-foreground mt-4">{note}</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default ResumePage;
