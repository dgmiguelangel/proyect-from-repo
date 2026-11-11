import { useEffect, useState } from "react";
import { api, ClientError, type Product } from "../services/api";
import { LowStockTable } from "../components/LowStockTable";

export function LowStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => { api.lowStock().then(setProducts).catch((error: ClientError) => setMessage(error.message)); }, []);
  return (
    <section className="page-card space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Stock bajo</h1>
        <p className="mt-1 text-slate-600">Productos que requieren reposición.</p>
      </div>
      {message && <p className="alert" role="alert">{message}</p>}
      <LowStockTable products={products} />
    </section>
  );
}
