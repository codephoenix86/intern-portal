// client/src/pages/mentor/MentorDashboard.tsx

import { Routes, Route } from "react-router-dom";
import MentorLayout from "@/components/mentor/MentorLayout";

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
          <MentorLayout title="Dashboard">
            <MentorHome />
          </MentorLayout>
        }
      />

      <Route
        path="/courses"
        element={
          <MentorLayout title="Courses">
            <MentorCoursesPage />
          </MentorLayout>
        }
      />

      <Route
        path="/courses/new"
        element={
          <MentorLayout title="New course">
            <MentorCourseNewPage />
          </MentorLayout>
        }
      />

      <Route
        path="/courses/:courseId/students"
        element={
          <MentorLayout title="Enrolled students">
            <MentorCourseStudentsPage />
          </MentorLayout>
        }
      />

      <Route
        path="/courses/:courseId"
        element={
          <MentorLayout title="Course">
            <MentorCourseDetailPage />
          </MentorLayout>
        }
      />

      <Route
        path="/trainings"
        element={
          <MentorLayout title="Skill Trainings">
            <MentorTrainings />
          </MentorLayout>
        }
      />

      <Route
        path="/classes"
        element={
          <MentorLayout title="Classes">
            <MentorClasses />
          </MentorLayout>
        }
      />

      <Route
        path="/students"
        element={
          <MentorLayout title="My Students">
            <MentorStudents />
          </MentorLayout>
        }
      />

      <Route
        path="/assignments"
        element={
          <MentorLayout title="Assignments">
            <MentorAssignments />
          </MentorLayout>
        }
      />

      <Route
        path="/progress"
        element={
          <MentorLayout title="Progress Tracking">
            <MentorProgress />
          </MentorLayout>
        }
      />

      <Route
        path="/messages"
        element={
          <MentorLayout title="Messages">
            <MentorMessages />
          </MentorLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <MentorLayout title="Settings">
            <MentorSettings />
          </MentorLayout>
        }
      />
    </Routes>
  );
};

export default MentorDashboard;
