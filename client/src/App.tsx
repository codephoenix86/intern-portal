// client/src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ── Public Pages ─────────────────────────────────────────────
import Index from "@/pages/students/Index";
import Internships from "@/pages/students/Internships";
import InternshipDetail from "@/pages/students/InternshipDetail";

// ── Auth Pages ───────────────────────────────────────────────
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// ── Dashboard Pages ──────────────────────────────────────────
import StudentDashboard from "@/pages/students/StudentDashboard";
import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";
import MentorDashboard from "@/pages/mentor/MentorDashboard";

// ── Fallback ─────────────────────────────────────────────────
import NotFound from "@/pages/NotFound";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ── Public ─── */}
          <Route path="/" element={<Index />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:id" element={<InternshipDetail />} />
          <Route path="/about" element={<About />} />

          {/* ── Auth ───*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Dashboards ── */}
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/recruiter/*" element={<RecruiterDashboard />} />
          <Route path="/mentor/*" element={<MentorDashboard />} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
