import ResumeUpload from "@/components/ResumeUpload";
import SkillTag from "@/components/SkillTag";
import { parsedResume } from "@/data/mockData";

const ResumePage = () => {
  return (
    <div className="space-y-6">
      <ResumeUpload />

      <div className="glass-card rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-4">
          Parsed Resume Data
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium text-foreground ml-2">
              {parsedResume.name}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-foreground ml-2">
              {parsedResume.email}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium text-foreground ml-2">
              {parsedResume.phone}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Education:</span>
            <span className="font-medium text-foreground ml-2">
              {parsedResume.education[0].degree}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-sm text-muted-foreground">Skills:</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {parsedResume.skills.map((s) => (
              <SkillTag key={s} skill={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
