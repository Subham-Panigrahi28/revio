import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App.jsx";

describe("Revio Frontend Application Shell", () => {
  it("renders Revio landing page hero section without crashing", () => {
    render(<App />);
    expect(screen.getByText("Your repository already knows what shipped.")).toBeDefined();
    expect(screen.getByText("Revio turns it into something a customer can read.")).toBeDefined();
  });
});
