import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CatalogPage } from "../src/pages/CatalogPage";

const mockedApi = vi.hoisted(() => ({
  products: vi.fn(),
  product: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
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

describe("catálogo", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.products.mockResolvedValue([]);
  });

  it("busca un producto por código y muestra su detalle", async () => {
    mockedApi.product.mockResolvedValue(product);
    render(<CatalogPage />);

    fireEvent.change(await screen.findByLabelText("Buscar por código"), { target: { value: product.code } });
    fireEvent.click(screen.getByRole("button", { name: "Buscar producto" }));

    await waitFor(() => expect(mockedApi.product).toHaveBeenCalledWith(product.code));
    expect(await screen.findByText(product.name)).toBeInTheDocument();
  });

  it("crea productos mediante la API", async () => {
    mockedApi.createProduct.mockResolvedValue(product);
    render(<CatalogPage />);

    fireEvent.change(await screen.findByLabelText("Código"), { target: { value: product.code } });
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: product.name } });
    fireEvent.change(screen.getByLabelText("Descripción"), { target: { value: product.description } });
    fireEvent.submit(screen.getByRole("button", { name: "Crear" }).closest("form")!);

    await waitFor(() => expect(mockedApi.createProduct).toHaveBeenCalledWith(expect.objectContaining({
      code: product.code,
      name: product.name,
      description: product.description,
    })));
  });

  it("edita y elimina productos mediante la API", async () => {
    mockedApi.updateProduct.mockResolvedValue(product);
    mockedApi.deleteProduct.mockResolvedValue(undefined);
    mockedApi.products.mockResolvedValue([product]);
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<CatalogPage />);

    expect(await screen.findByText(product.name)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    await waitFor(() => expect(screen.getByLabelText("Nombre")).toHaveValue(product.name));
    fireEvent.submit(screen.getByRole("button", { name: "Guardar" }).closest("form")!);
    await waitFor(() => expect(mockedApi.updateProduct).toHaveBeenCalledWith(product.code, expect.any(Object)));

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    await waitFor(() => expect(mockedApi.deleteProduct).toHaveBeenCalledWith(product.code));
  });

  it("muestra el error de una búsqueda inexistente", async () => {
    mockedApi.product.mockRejectedValue(new Error("El producto no fue encontrado."));
    render(<CatalogPage />);

    fireEvent.change(await screen.findByLabelText("Buscar por código"), { target: { value: "NO-EXISTE" } });
    fireEvent.click(screen.getByRole("button", { name: "Buscar producto" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("El producto no fue encontrado.");
  });
});
