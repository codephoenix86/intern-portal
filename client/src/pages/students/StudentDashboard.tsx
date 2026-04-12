import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { STUDENT_SIDEBAR_SECTIONS } from "@/constants/student.sidebar";

import DashboardHome from "./DashboardHome";
import SearchInternships from "./SearchInternships";
import RecommendedInternships from "./RecommendedInternships";
import ResumePage from "./ResumePage";
import SkillEvaluation from "./SkillEvaluation";
import SkillRoadmap from "./SkillRoadmap";
import Applications from "./Applications";
import SettingsPage from "./SettingsPage";
import StudentSessions from "./StudentSessions";
import ProfilePage from "./ProfilePage";
import DashboardStudents from "./DashboardStudents";
import DashboardRecruiters from "./DashboardRecruiters";
import DashboardMentors from "./DashboardMentors";
import CourseCatalog from "./CourseCatalog";
import CourseDetail from "./CourseDetail";
import MyEnrollments from "./MyEnrollments";

const StudentDashboard = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Dashboard"
          >
            <DashboardHome />
          </DashboardLayout>
        }
      />

      <Route
        path="/search"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Search Internships"
          >
            <SearchInternships />
          </DashboardLayout>
        }
      />

      <Route
        path="/recommended"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Recommended"
          >
            <RecommendedInternships />
          </DashboardLayout>
        }
      />

      <Route
        path="/sessions"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Live Sessions"
          >
            <StudentSessions />
          </DashboardLayout>
        }
      />

      <Route
        path="/resume"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Resume"
          >
            <ResumePage />
          </DashboardLayout>
        }
      />

      <Route
        path="/skills"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Skill Evaluation"
          >
            <SkillEvaluation />
          </DashboardLayout>
        }
      />

      <Route
        path="/roadmap"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Skill Roadmap"
          >
            <SkillRoadmap />
          </DashboardLayout>
        }
      />

      <Route
        path="/applications"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Applications"
          >
            <Applications />
          </DashboardLayout>
        }
      />

      <Route
        path="/courses"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Courses"
          >
            <CourseCatalog />
          </DashboardLayout>
        }
      />

      <Route
        path="/courses/:courseId"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Course"
          >
            <CourseDetail />
          </DashboardLayout>
        }
      />

      <Route
        path="/enrollments"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="My courses"
          >
            <MyEnrollments />
          </DashboardLayout>
        }
      />

      {/* ── People Pages (NEW) ── */}
      <Route
        path="/people/students"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Students"
          >
            <DashboardStudents />
          </DashboardLayout>
        }
      />

      <Route
        path="/people/recruiters"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Recruiters"
          >
            <DashboardRecruiters />
          </DashboardLayout>
        }
      />

      <Route
        path="/people/mentors"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Mentors"
          >
            <DashboardMentors />
          </DashboardLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Settings"
          >
            <SettingsPage />
          </DashboardLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <DashboardLayout
            sections={STUDENT_SIDEBAR_SECTIONS}
            role="student"
            title="Profile"
          >
            <ProfilePage />
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default StudentDashboard;
