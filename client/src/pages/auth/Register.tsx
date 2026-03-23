// client/src/pages/auth/Register.tsx

import { Link } from "react-router-dom";
import AuthLogo from "@/components/auth/AuthLogo";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthDivider from "@/components/auth/AuthDivider";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
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

          <RegisterForm />

          <AuthDivider />

          <GoogleAuthButton />

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
