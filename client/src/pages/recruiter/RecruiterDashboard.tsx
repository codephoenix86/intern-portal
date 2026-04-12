// client/src/pages/recruiter/RecruiterDashboard.tsx

import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { RECRUITER_SIDEBAR_SECTIONS } from "@/constants/recruiter.sidebar";

import Overview from "./Overview";
import PostInternship from "./PostInternship";
import MyListings from "./MyListings";
import ApplicantsList from "./ApplicantsList";
import RecruiterNotifications from "./RecruiterNotifications";
import RecruiterSettings from "./RecruiterSettings";
const RecruiterDashboard = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout
            sections={RECRUITER_SIDEBAR_SECTIONS}
            role="recruiter"
            title="Overview"
          >
            <Overview />
          </DashboardLayout>
        }
      />

      <Route
        path="/post"
        element={
          <DashboardLayout
            sections={RECRUITER_SIDEBAR_SECTIONS}
            role="recruiter"
            title="Post Internship"
          >
            <PostInternship />
          </DashboardLayout>
        }
      />

      <Route
        path="/listings"
        element={
          <DashboardLayout
            sections={RECRUITER_SIDEBAR_SECTIONS}
            role="recruiter"
            title="My Listings"
          >
            <MyListings />
          </DashboardLayout>
        }
      />

      <Route
        path="/applicants"
        element={
          <DashboardLayout
            sections={RECRUITER_SIDEBAR_SECTIONS}
            role="recruiter"
            title="Applicants"
          >
            <ApplicantsList />
          </DashboardLayout>
        }
      />

      <Route
        path="/notifications"
        element={
          <DashboardLayout
            sections={RECRUITER_SIDEBAR_SECTIONS}
            role="recruiter"
            title="Notifications"
          >
            <RecruiterNotifications />
          </DashboardLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <DashboardLayout
            sections={RECRUITER_SIDEBAR_SECTIONS}
            role="recruiter"
            title="Settings"
          >
            <RecruiterSettings />
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default RecruiterDashboard;
