import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Auth ─────────────────────────────────────────────
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// ── Public Pages ─────────────────────────────────────
import Index from "@/pages/students/Index";
import Internships from "@/pages/students/Internships";
import InternshipDetail from "@/pages/students/InternshipDetail";

// ── Auth Pages ───────────────────────────────────────
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// ── Dashboard Pages ──────────────────────────────────
import StudentDashboard from "@/pages/students/StudentDashboard";
import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";
import MentorDashboard from "@/pages/mentor/MentorDashboard";

// ── Fallback ─────────────────────────────────────────
import NotFound from "@/pages/NotFound";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ── Public ─── */}
            <Route path="/" element={<Index />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:id" element={<InternshipDetail />} />
            <Route path="/about" element={<About />} />

            {/* ── Auth ─── */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ── Protected Dashboards ── */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Navigate to="/student/profile" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/*"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentor/*"
              element={
                <ProtectedRoute allowedRoles={["mentor"]}>
                  <MentorDashboard />
                </ProtectedRoute>
              }
            />

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
