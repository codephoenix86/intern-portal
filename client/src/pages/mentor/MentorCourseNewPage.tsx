import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { mentorCoursesService } from "@/services/mentorCourses.service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const MentorCourseNewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("4 Weeks");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Beginner",
  );
  const [skills, setSkills] = useState("");
  const [price, setPrice] = useState("0");
  const [publish, setPublish] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const amount = Number(price);
      if (Number.isNaN(amount) || amount < 0) {
        toast({ title: "Invalid price", variant: "destructive" });
        setSubmitting(false);
        return;
      }
      const skillList = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const { courseId } = await mentorCoursesService.create({
        title: title.trim(),
        description: description.trim(),
        shortDescription: shortDescription.trim() || undefined,
        category: category.trim(),
        duration: duration.trim(),
        level,
        skills: skillList.length ? skillList : undefined,
        pricing: { amount, currency: "INR", discountPercent: 0 },
        isPublished: publish,
      });
      toast({ title: "Course created" });
      void navigate(`/mentor/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      toast({
        title: "Could not create course",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="short">Short description (optional)</Label>
        <Input
          id="short"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          maxLength={300}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="desc">Full description</Label>
        <Textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          maxLength={5000}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Level</Label>
          <Select
            value={level}
            onValueChange={(v) =>
              setLevel(v as "Beginner" | "Intermediate" | "Advanced")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cat">Category</Label>
        <Input
          id="cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          placeholder="e.g. Web Development"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="React, Node.js"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price (INR, 0 = free)</Label>
        <Input
          id="price"
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={publish}
          onChange={(e) => setPublish(e.target.checked)}
        />
        Publish immediately
      </label>
      <Button type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Create course"
        )}
      </Button>
    </form>
  );
};

export default MentorCourseNewPage;
