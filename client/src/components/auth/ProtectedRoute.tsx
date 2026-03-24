import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const roleRedirect: Record<UserRole, string> = {
      student: "/student",
      mentor: "/mentor",
      recruiter: "/recruiter",
    };
    return <Navigate to={roleRedirect[user.role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
