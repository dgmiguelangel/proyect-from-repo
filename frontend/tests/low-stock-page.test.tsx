import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../src/App";

describe("stock bajo", () => {
  it("permite navegar a stock bajo", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Stock bajo" })).toBeInTheDocument();
  });
});
