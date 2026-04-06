import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mentorCoursesService,
  type MentorCourseDetail,
} from "@/services/mentorCourses.service";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users } from "lucide-react";

const MentorCourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  const [course, setCourse] = useState<MentorCourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [modTitle, setModTitle] = useState("");
  const [modType, setModType] = useState<"video" | "pdf" | "notes" | "link">(
    "video",
  );
  const [modFree, setModFree] = useState(false);
  const [adding, setAdding] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const load = async (): Promise<void> => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await mentorCoursesService.get(courseId);
      setCourse(res.course);
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load course", variant: "destructive" });
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [courseId, toast]);

  const togglePublish = async (): Promise<void> => {
    if (!courseId || !course) return;
    try {
      await mentorCoursesService.update(courseId, {
        isPublished: !course.isPublished,
      });
      toast({
        title: course.isPublished ? "Unpublished" : "Published",
      });
      await load();
    } catch (e) {
      console.error(e);
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const addModule = async (): Promise<void> => {
    if (!courseId || !modTitle.trim()) return;
    setAdding(true);
    try {
      await mentorCoursesService.addModule(courseId, {
        title: modTitle.trim(),
        contentType: modType,
        isFree: modFree,
      });
      setModTitle("");
      setModFree(false);
      toast({ title: "Module added" });
      await load();
    } catch (e) {
      console.error(e);
      toast({ title: "Could not add module", variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const onUpload = async (
    moduleId: string,
    file: File | null,
  ): Promise<void> => {
    if (!courseId || !file) return;
    setUploadingId(moduleId);
    try {
      await mentorCoursesService.uploadModuleFile(courseId, moduleId, file);
      toast({ title: "File attached to module" });
      await load();
    } catch (e) {
      console.error(e);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploadingId(null);
    }
  };

  if (loading || !courseId) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!course) {
    return <p className="text-sm text-muted-foreground">Course not found.</p>;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{course.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {course.level} · {course.duration} · {course.category}
            {course.isPublished ? (
              <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                Published
              </span>
            ) : (
              <span className="ml-2">Draft</span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/mentor/courses/${courseId}/students`}>
              <Users className="h-4 w-4" />
              Enrolled students
            </Link>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => void togglePublish()}>
            {course.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="font-medium">Modules</h3>
        <ul className="space-y-3 border rounded-lg p-4">
          {course.modules
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((m) => (
              <li
                key={m.id ?? m.title}
                className="flex flex-col gap-2 border-b last:border-0 pb-3 last:pb-0"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium">{m.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.contentType}
                    {m.isFree ? " · Preview" : ""}
                  </span>
                </div>
                {m.contentUrl && (
                  <a
                    href={m.contentUrl}
                    className="text-sm text-primary underline-offset-4 hover:underline break-all"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {m.contentUrl}
                  </a>
                )}
                {m.id && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,video/mp4,video/webm"
                      className="max-w-xs text-sm"
                      disabled={uploadingId === m.id}
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        void onUpload(m.id!, f);
                        e.target.value = "";
                      }}
                    />
                    {uploadingId === m.id && (
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    )}
                  </div>
                )}
              </li>
            ))}
          {course.modules.length === 0 && (
            <li className="text-sm text-muted-foreground">No modules yet.</li>
          )}
        </ul>
      </section>

      <section className="space-y-3 border rounded-lg p-4">
        <h3 className="font-medium">Add module</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="mtitle">Title</Label>
            <Input
              id="mtitle"
              value={modTitle}
              onChange={(e) => setModTitle(e.target.value)}
              placeholder="e.g. Introduction to React"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={modType}
              onValueChange={(v) =>
                setModType(v as "video" | "pdf" | "notes" | "link")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm pt-8">
            <input
              type="checkbox"
              checked={modFree}
              onChange={(e) => setModFree(e.target.checked)}
            />
            Free preview module
          </label>
        </div>
        <Button
          type="button"
          onClick={() => void addModule()}
          disabled={adding || !modTitle.trim()}
        >
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add module"
          )}
        </Button>
      </section>

      <Button variant="ghost" asChild>
        <Link to="/mentor/courses">← Back to courses</Link>
      </Button>
    </div>
  );
};

export default MentorCourseDetailPage;
