import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICANT_STATUS_FILTERS } from "@/constants/recruiter.constants";

interface ApplicantStatusSelectProps {
  currentStatus: string;
  onChange?: (value: string) => void;
}

const ApplicantStatusSelect = ({
  currentStatus,
  onChange,
}: ApplicantStatusSelectProps) => {
  // Filter out "all" — not a valid applicant status
  const statusOptions = APPLICANT_STATUS_FILTERS.filter((s) => s !== "all");

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={currentStatus} />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ApplicantStatusSelect;
