import { useEffect, useState } from "react";
import { api, ClientError, type Product } from "../services/api";
import { LowStockTable } from "../components/LowStockTable";

export function LowStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => { api.lowStock().then(setProducts).catch((error: ClientError) => setMessage(error.message)); }, []);
  return <section><h1>Stock bajo</h1>{message && <p role="alert">{message}</p>}<LowStockTable products={products} /></section>;
}
