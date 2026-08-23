import React from "react";
import { createBrowserRouter, Navigate, Link } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage.jsx";
import { ConnectPage } from "../pages/ConnectPage.jsx";
import { OnboardingPage } from "../pages/OnboardingPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { ReleaseEditorPage } from "../pages/ReleaseEditorPage.jsx";
import { PublishGatePage } from "../pages/PublishGatePage.jsx";
import { PublicChangelogPage } from "../pages/PublicChangelogPage.jsx";
import { DistributionPage } from "../pages/DistributionPage.jsx";
import { SettingsPage } from "../pages/SettingsPage.jsx";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-meta text-signal font-bold">404 — ROUTE NOT FOUND</h1>
        <h2 className="text-editorial mt-3 text-4xl text-foreground">Page Not Found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The requested route does not exist or is not part of the active release build.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center bg-signal px-4 py-2 text-sm font-medium text-signal-foreground transition-opacity hover:opacity-90"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/connect",
    element: <ConnectPage />,
  },
  {
    path: "/login",
    element: <ConnectPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/releases",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/releases/:id",
    element: <ReleaseEditorPage />,
  },
  {
    path: "/changelogs/:id/edit",
    element: <ReleaseEditorPage />,
  },
  {
    path: "/publish/:id",
    element: <PublishGatePage />,
  },
  {
    path: "/changelog",
    element: <PublicChangelogPage />,
  },
  {
    path: "/c/:slug",
    element: <PublicChangelogPage />,
  },
  {
    path: "/distribution",
    element: <DistributionPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
