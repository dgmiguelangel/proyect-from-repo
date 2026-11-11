import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MovementsPage } from "../src/pages/MovementsPage";

const mockedApi = vi.hoisted(() => ({
  product: vi.fn(),
  movements: vi.fn(),
  createMovement: vi.fn(),
}));

vi.mock("../src/services/api", () => ({
  api: mockedApi,
  ClientError: class ClientError extends Error {
    constructor(public readonly code: string, message: string) {
      super(message);
    }
  },
}));

const product = {
  id: 1,
  code: "SKU-1",
  name: "Café",
  description: "Molido",
  price: 12.5,
  quantityAvailable: 4,
  minimumStock: 2,
};

describe("movimientos", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.product.mockResolvedValue(product);
    mockedApi.movements.mockResolvedValue([{ id: 1, productId: 1, type: "ENTRY", quantity: 2, createdAt: "2026-11-11" }]);
  });

  it("busca un producto, registra una entrada y muestra el historial", async () => {
    mockedApi.createMovement.mockResolvedValue({});
    render(<MovementsPage />);

    fireEvent.change(screen.getByLabelText("Código"), { target: { value: product.code } });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    expect(await screen.findByText((_, element) => element?.textContent === "Café: 4 disponibles")).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /2026-11-11.*Entrada.*2/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Registrar movimiento" }));
    await waitFor(() => expect(mockedApi.createMovement).toHaveBeenCalledWith(product.code, { type: "ENTRY", quantity: 1 }));
  });

  it("muestra el rechazo de stock insuficiente", async () => {
    mockedApi.createMovement.mockRejectedValue(new Error("Stock disponible insuficiente."));
    render(<MovementsPage />);

    fireEvent.change(screen.getAllByLabelText("Código").at(-1)!, { target: { value: product.code } });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    await screen.findByText((_, element) => element?.textContent === "Café: 4 disponibles");
    fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "EXIT" } });
    fireEvent.click(screen.getByRole("button", { name: "Registrar movimiento" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Stock disponible insuficiente.");
  });
});
