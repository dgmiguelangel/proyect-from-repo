import type { Movement } from "../services/api";

export function MovementHistory({ movements }: { movements: Movement[] }) {
  return <div className="table-wrapper"><table className="data-table"><thead><tr><th>Fecha</th><th>Tipo</th><th>Cantidad</th></tr></thead>
    <tbody>{movements.map((movement) => <tr key={movement.id}><td>{movement.createdAt}</td><td>{movement.type === "ENTRY" ? "Entrada" : "Salida"}</td><td>{movement.quantity}</td></tr>)}</tbody></table></div>;
}
