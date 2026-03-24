import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get redirect path from location state (if user was redirected to login)
  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname;

  const getRedirectPath = (role: string): string => {
    // If user was redirected from a specific page, go back there
    if (from) return from;

    switch (role) {
      case "student":
        return "/student";
      case "mentor":
        return "/mentor";
      case "recruiter":
        return "/recruiter";
      default:
        return "/student";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });

      // Get stored user from localStorage token (decoded) or fetch
      const token = localStorage.getItem("accessToken");
      if (token) {
        // Decode JWT to get role (simple base64 decode)
        const payload = JSON.parse(atob(token.split(".")[1]!));
        const redirectPath = getRedirectPath(payload.role);

        toast({
          title: "Welcome back! 👋",
          description: "You've been logged in successfully.",
        });

        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string;
        errors?: Record<string, string[]>;
      }>;

      toast({
        title: "Login Failed",
        description:
          axiosError.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full gradient-primary text-primary-foreground border-0"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
