export type Product = { id: number; code: string; name: string; description: string; price: number; quantityAvailable: number; minimumStock: number };
export type Movement = { id: number; productId: number; type: "ENTRY" | "EXIT"; quantity: number; createdAt: string };

export class ClientError extends Error {
  constructor(public readonly code: string, message: string) { super(message); }
}

const baseUrl = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { headers: { "Content-Type": "application/json" }, ...init });
  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new ClientError(body?.error?.code ?? "REQUEST_ERROR", body?.error?.message ?? "No se pudo completar la operación.");
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const api = {
  products: () => request<Product[]>("/products"),
  lowStock: () => request<Product[]>("/products/low-stock"),
  product: (code: string) => request<Product>(`/products/${encodeURIComponent(code)}`),
  createProduct: (input: Omit<Product, "id" | "quantityAvailable">) => request<Product>("/products", { method: "POST", body: JSON.stringify(input) }),
  updateProduct: (code: string, input: Partial<Omit<Product, "id" | "code" | "quantityAvailable">>) => request<Product>(`/products/${encodeURIComponent(code)}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteProduct: (code: string) => request<void>(`/products/${encodeURIComponent(code)}`, { method: "DELETE" }),
  movements: (code: string) => request<Movement[]>(`/products/${encodeURIComponent(code)}/movements`),
  createMovement: (code: string, input: { type: "ENTRY" | "EXIT"; quantity: number }) => request<Movement>(`/products/${encodeURIComponent(code)}/movements`, { method: "POST", body: JSON.stringify(input) })
};
