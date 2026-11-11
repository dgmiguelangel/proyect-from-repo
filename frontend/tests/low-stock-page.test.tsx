import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LowStockPage } from "../src/pages/LowStockPage";

const mockedApi = vi.hoisted(() => ({ lowStock: vi.fn() }));

vi.mock("../src/services/api", () => ({
  api: mockedApi,
  ClientError: class ClientError extends Error {
    constructor(public readonly code: string, message: string) {
      super(message);
    }
  },
}));

describe("stock bajo", () => {
  afterEach(cleanup);

  beforeEach(() => vi.clearAllMocks());

  it("muestra el estado vacío cuando no hay productos para reponer", async () => {
    mockedApi.lowStock.mockResolvedValue([]);
    render(<LowStockPage />);

    expect(await screen.findByText("No hay productos con stock bajo.")).toBeInTheDocument();
  });

  it("muestra los productos cuyo stock alcanzó el mínimo", async () => {
    mockedApi.lowStock.mockResolvedValue([{
      id: 1,
      code: "SKU-1",
      name: "Café",
      description: "Molido",
      price: 12.5,
      quantityAvailable: 2,
      minimumStock: 2,
    }]);
    render(<LowStockPage />);

    expect(await screen.findByText("Café")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
