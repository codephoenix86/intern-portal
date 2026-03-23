import { ROLE_OPTIONS } from "@/constants/auth.roles";
import type { UserRole } from "@/types/auth.types";

interface RoleSelectorProps {
  selected: UserRole;
  onChange: (role: UserRole) => void;
}

const RoleSelector = ({ selected, onChange }: RoleSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {ROLE_OPTIONS.map((option) => {
        const isActive = selected === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              isActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            {/* Icon */}
            <div
              className={`flex justify-center mb-1.5 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {option.icon}
            </div>

            {/* Label */}
            <p
              className={`text-sm font-medium ${
                isActive ? "text-primary" : "text-foreground"
              }`}
            >
              {option.label}
            </p>

            {/* Description */}
            <p className="text-xs text-muted-foreground">
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
