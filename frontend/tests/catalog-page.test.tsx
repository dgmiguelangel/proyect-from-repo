import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../src/App";

describe("catálogo", () => {
  it("muestra la página de catálogo", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Catálogo" })).toBeInTheDocument();
  });
});
