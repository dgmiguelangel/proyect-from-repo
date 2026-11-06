import type { Product } from "../services/api";

export function LowStockTable({ products }: { products: Product[] }) {
  if (!products.length) return <p>No hay productos con stock bajo.</p>;
  return <table><thead><tr><th>Código</th><th>Nombre</th><th>Disponible</th><th>Mínimo</th></tr></thead>
    <tbody>{products.map((product) => <tr key={product.code}><td>{product.code}</td><td>{product.name}</td><td>{product.quantityAvailable}</td><td>{product.minimumStock}</td></tr>)}</tbody></table>;
}
