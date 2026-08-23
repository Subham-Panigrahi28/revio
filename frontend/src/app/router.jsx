import React from "react";
import { createBrowserRouter, Navigate, Link, useParams } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage.jsx";
import { ConnectPage } from "../pages/ConnectPage.jsx";
import { OnboardingPage } from "../pages/OnboardingPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { ActivityPage } from "../pages/ActivityPage.jsx";
import { ReleasesPage } from "../pages/ReleasesPage.jsx";
import { ReleaseEditorPage } from "../pages/ReleaseEditorPage.jsx";
import { PublicChangelogPage } from "../pages/PublicChangelogPage.jsx";
import { DistributionPage } from "../pages/DistributionPage.jsx";
import { SettingsPage } from "../pages/SettingsPage.jsx";

function RedirectToPublishModal() {
  const { id } = useParams();
  return <Navigate to={`/releases/${id || "v2-14-0"}?publish=true`} replace />;
}

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
    path: "/activity",
    element: <ActivityPage />,
  },
  {
    path: "/releases",
    element: <ReleasesPage />,
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
    element: <RedirectToPublishModal />,
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
    path: "/c/:slug/v/:version",
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
