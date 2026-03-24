// client/src/pages/recruiter/RecruiterDashboard.tsx

import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { RECRUITER_SIDEBAR_ITEMS } from "@/constants/recruiter.sidebar";

import Overview from "./Overview";
import PostInternship from "./PostInternship";
import MyListings from "./MyListings";
import ApplicantsList from "./ApplicantsList";
import RecruiterNotifications from "./RecruiterNotifications";
import RecruiterSettings from "./RecruiterSettings";
import { useOAuthCallback } from "@/hooks/useOAuthCallback";

const RecruiterDashboard = () => {
  useOAuthCallback();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout
            sidebarItems={RECRUITER_SIDEBAR_ITEMS}
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
            sidebarItems={RECRUITER_SIDEBAR_ITEMS}
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
            sidebarItems={RECRUITER_SIDEBAR_ITEMS}
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
            sidebarItems={RECRUITER_SIDEBAR_ITEMS}
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
            sidebarItems={RECRUITER_SIDEBAR_ITEMS}
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
            sidebarItems={RECRUITER_SIDEBAR_ITEMS}
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
