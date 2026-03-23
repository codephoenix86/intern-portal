import { Button } from "@/components/ui/button";
import {
  APPLICANT_STATUS_FILTERS,
  type ApplicantStatusFilter,
} from "@/constants/recruiter.constants";

interface ApplicantStatusFilterProps {
  active: ApplicantStatusFilter;
  onChange: (status: ApplicantStatusFilter) => void;
}

const ApplicantStatusFilterBar = ({
  active,
  onChange,
}: ApplicantStatusFilterProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {APPLICANT_STATUS_FILTERS.map((s) => (
        <Button
          key={s}
          size="sm"
          variant={active === s ? "default" : "outline"}
          onClick={() => onChange(s)}
          className="capitalize"
        >
          {s}
        </Button>
      ))}
    </div>
  );
};

export default ApplicantStatusFilterBar;
