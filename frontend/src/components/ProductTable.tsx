import type { Product } from "../services/api";

export function ProductTable({ products, onEdit, onDelete }: { products: Product[]; onEdit: (product: Product) => void; onDelete: (product: Product) => void }) {
  return <table><thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Disponible</th><th>Mínimo</th><th>Acciones</th></tr></thead>
    <tbody>{products.map((product) => <tr key={product.code}><td>{product.code}</td><td>{product.name}</td><td>{product.price}</td><td>{product.quantityAvailable}</td><td>{product.minimumStock}</td>
      <td><button onClick={() => onEdit(product)}>Editar</button><button onClick={() => onDelete(product)}>Eliminar</button></td></tr>)}</tbody></table>;
}
