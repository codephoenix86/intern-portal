import { Link } from "react-router-dom";
import AuthLogo from "@/components/auth/AuthLogo";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthDivider from "@/components/auth/AuthDivider";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthLogo />

          <h1 className="text-2xl font-bold text-foreground mb-1">
            Welcome back
          </h1>
          <p className="text-muted-foreground mb-6">Sign in to your account</p>

          <LoginForm />

          <AuthDivider />

          <GoogleAuthButton />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Branding */}
      <AuthBrandPanel
        title="Start Your Career Journey"
        description="AI-powered internship matching, skill assessment, and real-time application tracking."
      />
    </div>
  );
};

export default Login;
