import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthLogo from "@/components/auth/AuthLogo";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthDivider from "@/components/auth/AuthDivider";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/auth.types";

const Register = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  // If already logged in, redirect to dashboard
  if (!isLoading && isAuthenticated && user) {
    const roleRedirect: Record<string, string> = {
      student: "/student",
      mentor: "/mentor",
      recruiter: "/recruiter",
    };
    return <Navigate to={roleRedirect[user.role] || "/student"} replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <AuthBrandPanel
        title="Join InternPortal"
        description="Whether you're seeking an internship, hiring talent, or mentoring students, we've got you covered."
      />

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthLogo />

          <h1 className="text-2xl font-bold text-foreground mb-1">
            Create an account
          </h1>
          <p className="text-muted-foreground mb-6">
            Select your role to get started
          </p>

          {/* RegisterForm handles role internally, 
              but we also track it for GoogleAuthButton */}
          <RegisterForm onRoleChange={setSelectedRole} />

          <AuthDivider />

          {/* Pass selected role to Google OAuth */}
          <GoogleAuthButton role={selectedRole} />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
