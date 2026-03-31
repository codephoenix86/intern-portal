import { Button } from "@/components/ui/button";

interface ListingCardProps {
  id: string;
  title: string;
  applicants: number;
  postedDate: string;
  isActive?: boolean;
  onClose?: (id: string) => void | Promise<void>;
  isClosing?: boolean;
}

const ListingCard = ({
  id,
  title,
  applicants,
  postedDate,
  isActive = true,
  onClose,
  isClosing = false,
}: ListingCardProps) => {
  return (
    <div className="glass-card rounded-lg p-5 flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">
          {applicants} applicants • Posted {postedDate}
        </p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline">
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
