import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App.jsx";

describe("Revio Frontend Application Shell", () => {
  it("renders Revio landing page hero section without crashing", () => {
    render(<App />);
    expect(screen.getByText(/Turn what you ship into updates/i)).toBeDefined();
    expect(screen.getAllByText(/customers actually understand/i).length).toBeGreaterThan(0);
  });
});
