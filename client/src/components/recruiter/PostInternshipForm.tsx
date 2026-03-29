import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRecruiterJob } from "@/services/recruiterPortal.service";

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  company: z.string().trim().min(1, "Company is required"),
  location: z.string().trim().min(1, "Location is required"),
  type: z.enum(["remote", "onsite", "hybrid"], {
    required_error: "Select work type",
  }),
  duration: z.string().trim().min(1, "Duration is required"),
  stipend: z.string().trim().min(1, "Stipend is required"),
  skills: z
    .string()
    .trim()
    .min(1, "Add at least one skill (comma-separated)"),
  description: z.string().trim().min(1, "Description is required"),
  requirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PostInternshipForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      requirements: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const requirementsRaw = values.requirements?.trim();
      const requirements = requirementsRaw
        ? requirementsRaw
            .split("\n")
            .map((r) => r.trim())
            .filter(Boolean)
        : undefined;

      return createRecruiterJob({
        title: values.title,
        company: values.company,
        location: values.location,
        type: values.type,
        duration: values.duration,
        stipend: values.stipend,
        skills: values.skills,
        description: values.description,
        ...(requirements?.length ? { requirements } : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiter", "jobs"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter", "dashboard"] });
      toast.success("Internship published");
      reset();
      navigate("/recruiter/listings");
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
      toast.error(msg ?? "Could not publish internship.");
    },
  });

  return (
    <form
      className="glass-card rounded-lg p-6 space-y-4"
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      noValidate
    >
      <h3 className="font-semibold text-foreground">Post New Internship</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. Frontend Developer Intern"
            className="mt-1"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Your company name"
            className="mt-1"
            {...register("company")}
          />
          {errors.company && (
            <p className="text-xs text-destructive mt-1">
              {errors.company.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, Country"
            className="mt-1"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-xs text-destructive mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <Label>Type</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-xs text-destructive mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g. 3 months"
            className="mt-1"
            {...register("duration")}
          />
          {errors.duration && (
            <p className="text-xs text-destructive mt-1">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="stipend">Stipend</Label>
          <Input
            id="stipend"
            placeholder="e.g. ₹15,000/month"
            className="mt-1"
            {...register("stipend")}
          />
          {errors.stipend && (
            <p className="text-xs text-destructive mt-1">
              {errors.stipend.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="skills">Required Skills (comma-separated)</Label>
        <Input
          id="skills"
          placeholder="React, TypeScript, Node.js"
          className="mt-1"
          {...register("skills")}
        />
        {errors.skills && (
          <p className="text-xs text-destructive mt-1">{errors.skills.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the internship role..."
          className="mt-1"
          rows={5}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="requirements">Requirements (optional, one per line)</Label>
        <Textarea
          id="requirements"
          placeholder="Bachelor's in CS or related&#10;Strong communication skills"
          className="mt-1"
          rows={3}
          {...register("requirements")}
        />
      </div>

      <Button
        type="submit"
        className="gradient-primary text-primary-foreground border-0"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Publishing…" : "Publish Internship"}
      </Button>
    </form>
  );
};

export default PostInternshipForm;
