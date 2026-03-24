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
import { useOAuthCallback } from "@/hooks/useOAuthCallback";

const MentorDashboard = () => {
  useOAuthCallback();
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
