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

const PostInternshipForm = () => {
  return (
    <div className="glass-card rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-foreground">Post New Internship</h3>

      {/* Grid Fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Title</Label>
          <Input
            placeholder="e.g. Frontend Developer Intern"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Company</Label>
          <Input placeholder="Your company name" className="mt-1" />
        </div>

        <div>
          <Label>Location</Label>
          <Input placeholder="City, Country" className="mt-1" />
        </div>

        <div>
          <Label>Type</Label>
          <Select>
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
          <Input placeholder="e.g. 3 months" className="mt-1" />
        </div>

        <div>
          <Label>Stipend</Label>
          <Input placeholder="e.g. ₹15,000/month" className="mt-1" />
        </div>
      </div>

      {/* Full Width Fields */}
      <div>
        <Label>Required Skills (comma-separated)</Label>
        <Input placeholder="React, TypeScript, Node.js" className="mt-1" />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="Describe the internship role..."
          className="mt-1"
          rows={5}
        />
      </div>

      <Button className="gradient-primary text-primary-foreground border-0">
        Publish Internship
      </Button>
    </div>
  );
};

export default PostInternshipForm;
