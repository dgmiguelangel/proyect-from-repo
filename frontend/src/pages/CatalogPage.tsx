import { useEffect, useState } from "react";
import { api, ClientError, type Product } from "../services/api";
import { ProductForm } from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product>();
  const [message, setMessage] = useState("");
  const load = () => api.products().then(setProducts).catch((error: ClientError) => setMessage(error.message));
  useEffect(() => { void load(); }, []);
  const save = async (input: Omit<Product, "id" | "quantityAvailable">) => {
    try { editing ? await api.updateProduct(editing.code, input) : await api.createProduct(input); setEditing(undefined); setMessage(""); await load(); }
    catch (error) { setMessage((error as ClientError).message); }
  };
  const remove = async (product: Product) => {
    if (!window.confirm(`¿Eliminar ${product.code}?`)) return;
    try { await api.deleteProduct(product.code); await load(); } catch (error) { setMessage((error as ClientError).message); }
  };
  return (
    <section className="page-card space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Catálogo</h1>
        <p className="mt-1 text-slate-600">Administra los productos disponibles.</p>
      </div>
      {message && <p className="alert" role="alert">{message}</p>}
      <ProductForm product={editing} onSubmit={save} />
      <ProductTable products={products} onEdit={setEditing} onDelete={(product) => void remove(product)} />
    </section>
  );
}
