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

  it("limpia el formulario de creación sin modificar el catálogo", async () => {
    render(<CatalogPage />);

    fireEvent.change(await screen.findByLabelText("Código"), { target: { value: product.code } });
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: product.name } });
    fireEvent.change(screen.getByLabelText("Descripción"), { target: { value: product.description } });
    fireEvent.change(screen.getByLabelText("Precio"), { target: { value: "12.5" } });
    fireEvent.change(screen.getByLabelText("Stock mínimo"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));

    expect(screen.getByLabelText("Código")).toHaveValue("");
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
    expect(screen.getByLabelText("Descripción")).toHaveValue("");
    expect(screen.getByLabelText("Precio")).toHaveValue(0);
    expect(screen.getByLabelText("Stock mínimo")).toHaveValue(0);
    expect(mockedApi.createProduct).not.toHaveBeenCalled();
    expect(mockedApi.updateProduct).not.toHaveBeenCalled();
    expect(mockedApi.deleteProduct).not.toHaveBeenCalled();
  });

  it("restaura los valores guardados al limpiar el formulario de edición", async () => {
    mockedApi.products.mockResolvedValue([product]);
    render(<CatalogPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Té" } });
    fireEvent.change(screen.getByLabelText("Descripción"), { target: { value: "En hebras" } });
    fireEvent.change(screen.getByLabelText("Precio"), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText("Stock mínimo"), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));

    expect(screen.getByLabelText("Nombre")).toHaveValue(product.name);
    expect(screen.getByLabelText("Descripción")).toHaveValue(product.description);
    expect(screen.getByLabelText("Precio")).toHaveValue(product.price);
    expect(screen.getByLabelText("Stock mínimo")).toHaveValue(product.minimumStock);
    expect(mockedApi.createProduct).not.toHaveBeenCalled();
    expect(mockedApi.updateProduct).not.toHaveBeenCalled();
    expect(mockedApi.deleteProduct).not.toHaveBeenCalled();
  });

  it("cancela la edición y muestra el formulario de creación vacío", async () => {
    mockedApi.products.mockResolvedValue([product]);
    render(<CatalogPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Té" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByRole("button", { name: "Crear" })).toBeInTheDocument();
    expect(screen.getByLabelText("Código")).toHaveValue("");
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
    expect(screen.getByLabelText("Descripción")).toHaveValue("");
    expect(screen.getByLabelText("Precio")).toHaveValue(0);
    expect(screen.getByLabelText("Stock mínimo")).toHaveValue(0);
    expect(mockedApi.createProduct).not.toHaveBeenCalled();
    expect(mockedApi.updateProduct).not.toHaveBeenCalled();
    expect(mockedApi.deleteProduct).not.toHaveBeenCalled();
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
