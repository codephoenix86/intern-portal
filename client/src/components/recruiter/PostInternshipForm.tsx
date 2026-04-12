import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  recruiterPortalService,
  type CreateRecruiterJobPayload,
} from "@/services/recruiterPortal.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const splitCsv = (value: string): string[] =>
  value
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

const normalizeType = (
  value: string,
): CreateRecruiterJobPayload["type"] | "" => {
  if (value === "Remote" || value === "remote") return "remote";
  if (value === "On-site" || value === "onsite") return "onsite";
  if (value === "Hybrid" || value === "hybrid") return "hybrid";
  return "";
};

const PostInternshipForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingJobId = searchParams.get("edit");
  const isEditMode = Boolean(editingJobId);

  const [form, setForm] = useState<{
    title: string;
    company: string;
    location: string;
    type: CreateRecruiterJobPayload["type"] | "";
    duration: string;
    stipend: string;
    skills: string;
    description: string;
    requirements: string;
  }>({
    title: "",
    company: "",
    location: "",
    type: "",
    duration: "",
    stipend: "",
    skills: "",
    description: "",
    requirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(false);

  useEffect(() => {
    const loadExistingJob = async (): Promise<void> => {
      if (!editingJobId) return;

      try {
        setIsLoadingJob(true);
        const job = await recruiterPortalService.getJob(editingJobId);
        setForm({
          title: job.title ?? "",
          company: job.company ?? "",
          location: job.location ?? "",
          type: normalizeType(job.type),
          duration: job.duration ?? "",
          stipend: job.stipend ?? "",
          skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
          description: job.description ?? "",
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join(", ")
            : "",
        });
      } catch (e) {
        console.error("Failed to load listing for edit:", e);
        toast({
          title: "Could not load listing",
          description: "Please try again.",
          variant: "destructive",
        });
        navigate("/recruiter/listings");
      } finally {
        setIsLoadingJob(false);
      }
    };

    void loadExistingJob();
  }, [editingJobId, navigate, toast]);

  const submitListing = async (): Promise<void> => {
    if (!form.type) {
      toast({
        title: "Select internship type",
        description: "Please choose Remote, On-site, or Hybrid.",
        variant: "destructive",
      });
      return;
    }

    const parsedSkills = splitCsv(form.skills);
    if (parsedSkills.length === 0) {
      toast({
        title: "Add at least one skill",
        description: "Skills are required to publish or update a listing.",
        variant: "destructive",
      });
      return;
    }

    const payload: CreateRecruiterJobPayload = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      type: form.type,
      duration: form.duration.trim(),
      stipend: form.stipend.trim(),
      skills: parsedSkills,
      description: form.description.trim(),
      requirements: form.requirements
        ? splitCsv(form.requirements)
        : undefined,
    };

    try {
      setIsSubmitting(true);
      if (editingJobId) {
        await recruiterPortalService.updateJob(editingJobId, payload);
        toast({ title: "Listing updated" });
      } else {
        await recruiterPortalService.createJob(payload);
        toast({ title: "Internship published" });
      }
      navigate("/recruiter/listings");
    } catch (e) {
      console.error("Failed to submit internship listing:", e);
      toast({
        title: isEditMode ? "Update failed" : "Publish failed",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="glass-card rounded-lg p-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submitListing();
      }}
    >
      <h3 className="font-semibold text-foreground">
        {isEditMode ? "Edit Internship Listing" : "Post New Internship"}
      </h3>

      {isLoadingJob ? (
        <p className="text-sm text-muted-foreground">Loading listing details...</p>
      ) : null}

      {/* Grid Fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Title</Label>
          <Input
            placeholder="e.g. Frontend Developer Intern"
            className="mt-1"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </div>

        <div>
          <Label>Company</Label>
          <Input
            placeholder="Your company name"
            className="mt-1"
            value={form.company}
            onChange={(e) =>
              setForm((p) => ({ ...p, company: e.target.value }))
            }
          />
        </div>

        <div>
          <Label>Location</Label>
          <Input
            placeholder="City, Country"
            className="mt-1"
            value={form.location}
            onChange={(e) =>
              setForm((p) => ({ ...p, location: e.target.value }))
            }
          />
        </div>

        <div>
          <Label>Type</Label>
          <Select
            value={form.type}
            onValueChange={(value) =>
              setForm((p) => ({
                ...p,
                type: value as CreateRecruiterJobPayload["type"],
              }))
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Duration</Label>
          <Input
            placeholder="e.g. 3 months"
            className="mt-1"
            value={form.duration}
            onChange={(e) =>
              setForm((p) => ({ ...p, duration: e.target.value }))
            }
          />
        </div>

        <div>
          <Label>Stipend</Label>
          <Input
            placeholder="e.g. ₹15,000/month"
            className="mt-1"
            value={form.stipend}
            onChange={(e) =>
              setForm((p) => ({ ...p, stipend: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Full Width Fields */}
      <div>
        <Label>Required Skills (comma-separated)</Label>
        <Input
          placeholder="React, TypeScript, Node.js"
          className="mt-1"
          value={form.skills}
          onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="Describe the internship role..."
          className="mt-1"
          rows={5}
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
        />
      </div>

      <div>
        <Label>Requirements (comma-separated, optional)</Label>
        <Input
          placeholder="e.g. Knowledge of React, Git basics"
          className="mt-1"
          value={form.requirements}
          onChange={(e) =>
            setForm((p) => ({ ...p, requirements: e.target.value }))
          }
        />
      </div>

      <Button
        type="submit"
        className="gradient-primary text-primary-foreground border-0"
        disabled={isSubmitting || isLoadingJob}
      >
        {isSubmitting
          ? isEditMode
            ? "Saving..."
            : "Publishing..."
          : isEditMode
            ? "Save Changes"
            : "Publish Internship"}
      </Button>
    </form>
  );
};

export default PostInternshipForm;
