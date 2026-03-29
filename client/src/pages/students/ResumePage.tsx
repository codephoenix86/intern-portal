import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ResumeUpload from "@/components/ResumeUpload";
import SkillTag from "@/components/SkillTag";
import {
  getStudentProfile,
  uploadStudentResume,
} from "@/services/studentPortal.service";
import { toast } from "sonner";

type ParsedStub = {
  name?: string;
  email?: string;
  phone?: string | null;
  education?: Array<{ degree?: string }>;
  skills?: string[];
};

const ResumePage = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["student", "profile"],
    queryFn: getStudentProfile,
  });

  const upload = useMutation({
    mutationFn: (file: File) => uploadStudentResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
      toast.success("Resume uploaded");
    },
    onError: (err: unknown) => {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "message" in err.response.data
          ? String((err.response.data as { message?: string }).message)
          : null;
      toast.error(msg ?? "Upload failed — check file type (PDF/Word) and size (max 5MB).");
    },
  });

  const raw = profile?.parsedResume as ParsedStub | null | undefined;
  const skills = raw?.skills ?? [];
  const educationDegree = raw?.education?.[0]?.degree;

  return (
    <div className="space-y-6">
      <ResumeUpload
        onUpload={(file) => {
          upload.mutate(file);
        }}
      />
      {upload.isPending && (
        <p className="text-sm text-muted-foreground">Uploading…</p>
      )}

      <div className="glass-card rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-4">
          Parsed Resume Data
        </h3>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground ml-2">
                  {raw?.name ?? profile?.name ?? "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-foreground ml-2">
                  {raw?.email ?? profile?.email ?? "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium text-foreground ml-2">
                  {raw?.phone ?? profile?.phone ?? "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Education:</span>
                <span className="font-medium text-foreground ml-2">
                  {educationDegree ?? "—"}
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
                    Add skills in Settings or complete an upload — parsing may be
                    limited until a full parser is connected.
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumePage;
