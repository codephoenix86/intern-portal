// client/src/pages/mentor/MentorDashboard.tsx

import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { MENTOR_SIDEBAR_SECTIONS } from "@/constants/mentor.sidebar";

import MentorHome from "./MentorHome";
import MentorTrainings from "./MentorTrainings";
import MentorClasses from "./MentorClasses";
import MentorStudents from "./MentorStudents";
import MentorAssignments from "./MentorAssignments";
import MentorProgress from "./MentorProgress";
import MentorMessages from "./MentorMessage";
import MentorSettings from "./MentorSetting";
import MentorCoursesPage from "./MentorCoursesPage";
import MentorCourseNewPage from "./MentorCourseNewPage";
import MentorCourseDetailPage from "./MentorCourseDetailPage";
import MentorCourseStudentsPage from "./MentorCourseStudentsPage";

const MentorDashboard = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Dashboard"
          >
            <MentorHome />
          </DashboardLayout>
        }
      />

      <Route
        path="/courses"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Courses"
          >
            <MentorCoursesPage />
          </DashboardLayout>
        }
      />

      <Route
        path="/courses/new"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="New course"
          >
            <MentorCourseNewPage />
          </DashboardLayout>
        }
      />

      <Route
        path="/courses/:courseId/students"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Enrolled students"
          >
            <MentorCourseStudentsPage />
          </DashboardLayout>
        }
      />

      <Route
        path="/courses/:courseId"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Course"
          >
            <MentorCourseDetailPage />
          </DashboardLayout>
        }
      />

      <Route
        path="/trainings"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Skill trainings"
          >
            <MentorTrainings />
          </DashboardLayout>
        }
      />

      <Route
        path="/classes"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Classes"
          >
            <MentorClasses />
          </DashboardLayout>
        }
      />

      <Route
        path="/students"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="My students"
          >
            <MentorStudents />
          </DashboardLayout>
        }
      />

      <Route
        path="/assignments"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Assignments"
          >
            <MentorAssignments />
          </DashboardLayout>
        }
      />

      <Route
        path="/progress"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Progress tracking"
          >
            <MentorProgress />
          </DashboardLayout>
        }
      />

      <Route
        path="/messages"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Messages"
          >
            <MentorMessages />
          </DashboardLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <DashboardLayout
            sections={MENTOR_SIDEBAR_SECTIONS}
            role="mentor"
            title="Settings"
          >
            <MentorSettings />
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default MentorDashboard;
