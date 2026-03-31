import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICANT_STATUS_FILTERS } from "@/constants/recruiter.constants";

interface ApplicantStatusSelectProps {
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const ApplicantStatusSelect = ({
  value,
  disabled,
  onChange,
}: ApplicantStatusSelectProps) => {
  // Filter out "all" — not a valid applicant status
  const statusOptions = APPLICANT_STATUS_FILTERS.filter((s) => s !== "all");

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={value} />
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
