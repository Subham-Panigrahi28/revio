import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { WorkspaceProvider } from "../context/WorkspaceContext.jsx";
import { ReleaseProvider } from "../context/ReleaseContext.jsx";
import "../styles/index.css";

export default function App() {
  return (
    <WorkspaceProvider>
      <ReleaseProvider>
        <RouterProvider router={router} />
      </ReleaseProvider>
    </WorkspaceProvider>
  );
}
