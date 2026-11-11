import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../src/App";

describe("movimientos", () => {
  it("permite navegar a movimientos", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Movimientos" })).toHaveClass("nav-link");
  });
});
