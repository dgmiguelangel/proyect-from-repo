import { useEffect, useState } from "react";
import type { Product } from "../services/api";

type Input = Omit<Product, "id" | "quantityAvailable">;
const empty: Input = { code: "", name: "", description: "", price: 0, minimumStock: 0 };

export function ProductForm({ product, onSubmit }: { product?: Product; onSubmit: (input: Input) => Promise<void> }) {
  const [form, setForm] = useState<Input>(product ? { code: product.code, name: product.name, description: product.description, price: product.price, minimumStock: product.minimumStock } : empty);
  useEffect(() => {
    setForm(product
      ? { code: product.code, name: product.name, description: product.description, price: product.price, minimumStock: product.minimumStock }
      : empty);
  }, [product]);
  const change = (key: keyof Input, value: string) => setForm((current) => ({ ...current, [key]: key === "price" || key === "minimumStock" ? Number(value) : value }));
  return <form onSubmit={(event) => { event.preventDefault(); void onSubmit(form); }}>
    <label>Código<input value={form.code} disabled={Boolean(product)} onChange={(event) => change("code", event.target.value)} /></label>
    <label>Nombre<input value={form.name} onChange={(event) => change("name", event.target.value)} /></label>
    <label>Descripción<input value={form.description} onChange={(event) => change("description", event.target.value)} /></label>
    <label>Precio<input type="number" min="0" value={form.price} onChange={(event) => change("price", event.target.value)} /></label>
    <label>Stock mínimo<input type="number" min="0" value={form.minimumStock} onChange={(event) => change("minimumStock", event.target.value)} /></label>
    <button type="submit">{product ? "Guardar" : "Crear"}</button>
  </form>;
}
