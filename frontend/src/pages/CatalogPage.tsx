import { useEffect, useState } from "react";
import { api, ClientError, type Product } from "../services/api";
import { ProductForm } from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product>();
  const [message, setMessage] = useState("");
  const [searchCode, setSearchCode] = useState("");
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
  const search = async () => {
    try {
      const product = await api.product(searchCode);
      setProducts([product]);
      setMessage("");
    } catch (error) {
      setMessage((error as ClientError).message);
    }
  };
  const showCatalog = () => {
    setSearchCode("");
    void load();
  };
  return (
    <section className="page-card space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Catálogo</h1>
        <p className="mt-1 text-slate-600">Administra los productos disponibles.</p>
      </div>
      {message && <p className="alert" role="alert">{message}</p>}
      <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={(event) => { event.preventDefault(); void search(); }}>
        <label className="field flex-1">Buscar por código
          <input className="text-input" value={searchCode} onChange={(event) => setSearchCode(event.target.value)} />
        </label>
        <button className="primary-button" type="submit">Buscar producto</button>
        <button className="secondary-button" type="button" onClick={showCatalog}>Mostrar catálogo</button>
      </form>
      <ProductForm product={editing} onSubmit={save} onCancel={() => setEditing(undefined)} />
      <ProductTable products={products} onEdit={setEditing} onDelete={(product) => void remove(product)} />
    </section>
  );
}
