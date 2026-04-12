import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/types/auth.types";

interface RoleCardProps {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const RoleCard = ({
  label,
  description,
  icon,
  selected,
  onClick,
}: RoleCardProps) => (
  <Card
    className={`cursor-pointer transition-all hover:shadow-md ${
      selected
        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
        : "border-border hover:border-primary/50"
    }`}
    onClick={onClick}
  >
    <CardContent className="p-6 flex items-start gap-4">
      <div
        className={`p-3 rounded-lg ${
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{label}</h3>
          {selected && <CheckCircle2 className="h-5 w-5 text-primary" />}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const ROLES: {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "student",
    label: "Student",
    description:
      "Looking for internships, building skills, and tracking applications. Get matched with the best opportunities.",
    icon: <GraduationCap className="h-6 w-6" />,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description:
      "Post internship listings, review applicants, and find the best talent for your company.",
    icon: <Building2 className="h-6 w-6" />,
  },
  {
    value: "mentor",
    label: "Mentor",
    description:
      "Teach courses, conduct live sessions, and guide students on their career journey.",
    icon: <BookOpen className="h-6 w-6" />,
  },
];

const SelectRole = () => {
  const { user, isAuthenticated, isLoading, needsRoleSelection, selectRole } =
    useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Not authenticated → go to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Already has a role → go to dashboard
  if (!needsRoleSelection && user.role !== null) {
    const roleRedirect: Record<string, string> = {
      student: "/student",
      mentor: "/mentor",
      recruiter: "/recruiter",
    };
    return <Navigate to={roleRedirect[user.role] || "/student"} replace />;
  }

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "You need to choose a role before continuing.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await selectRole(selectedRole);

      toast({
        title: "Welcome! 🎉",
        description: `Your account is ready as a ${selectedRole}.`,
      });

      const redirectMap: Record<UserRole, string> = {
        student: "/student",
        recruiter: "/recruiter",
        mentor: "/mentor",
      };
      navigate(redirectMap[selectedRole], { replace: true });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ?? "Failed to select role. Try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              InternPortal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Choose your role
          </h1>
          <p className="text-muted-foreground">
            Welcome, <span className="font-medium">{user.name}</span>! Select
            how you'd like to use InternPortal.
          </p>
          <p className="text-xs text-muted-foreground">
            This cannot be changed later.
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3">
          {ROLES.map((role) => (
            <RoleCard
              key={role.value}
              {...role}
              selected={selectedRole === role.value}
              onClick={() => setSelectedRole(role.value)}
            />
          ))}
        </div>

        {/* Submit Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!selectedRole || submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Setting up your account...
            </>
          ) : (
            `Continue as ${selectedRole ? ROLES.find((r) => r.value === selectedRole)?.label : "..."}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default SelectRole;
