import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import RoleSelector from "./RoleSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import type { UserRole } from "@/types/auth.types";
import { APP_DISPLAY_NAME } from "@/constants/brand";

interface RegisterFormProps {
  onRoleChange?: (role: UserRole) => void;
}
const RegisterForm = ({ onRoleChange }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    onRoleChange?.(newRole);
  };

  const getRoleRedirect = (r: UserRole): string => {
    switch (r) {
      case "student":
        return "/student";
      case "mentor":
        return "/mentor";
      case "recruiter":
        return "/recruiter";
    }
  };

  const getRoleLabel = (r: UserRole): string => {
    const labels: Record<UserRole, string> = {
      student: "Student",
      recruiter: "Recruiter",
      mentor: "Mentor",
    };
    return labels[r];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({ name, email, password, role });

      toast({
        title: "Account Created! 🎉",
        description: `Welcome to ${APP_DISPLAY_NAME}, ${name}!`,
      });

      navigate(getRoleRedirect(role), { replace: true });
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string;
        errors?: Record<string, string[]>;
      }>;

      const serverErrors = axiosError.response?.data?.errors;

      if (serverErrors) {
        // Show validation errors
        const errorMessages = Object.entries(serverErrors)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
          .join("\n");

        toast({
          title: "Validation Error",
          description: errorMessages,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description:
            axiosError.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Role Selector */}
      <RoleSelector selected={role} onChange={handleRoleChange} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="John Doe"
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength={8}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Min 8 characters, 1 uppercase, 1 lowercase, 1 number
          </p>
        </div>

        <Button
          type="submit"
          className="w-full gradient-primary text-primary-foreground border-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            `Create ${getRoleLabel(role)} Account`
          )}
        </Button>
      </form>
    </>
  );
};

export default RegisterForm;
