import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BriefcaseBusiness } from "lucide-react";

interface ListingCardProps {
  id: string;
  title: string;
  applicants: number;
  postedDate: string;
  isActive?: boolean;
  onEdit?: (id: string) => void;
  onClose?: (id: string) => void | Promise<void>;
  isClosing?: boolean;
}

const ListingCard = ({
  id,
  title,
  applicants,
  postedDate,
  isActive = true,
  onEdit,
  onClose,
  isClosing = false,
}: ListingCardProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-display font-semibold text-foreground">{title}</h4>
          <Badge variant={isActive ? "default" : "secondary"} className="text-[10px] uppercase">
            {isActive ? "Live" : "Closed"}
          </Badge>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BriefcaseBusiness className="h-3.5 w-3.5 stroke-[1.65]" />
            {applicants} applicants
          </span>
          <span>Posted {postedDate}</span>
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit?.(id)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive"
          disabled={!isActive || isClosing || !onClose}
          onClick={() => onClose?.(id)}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ListingCard;
