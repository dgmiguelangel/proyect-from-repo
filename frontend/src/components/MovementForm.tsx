import { useState } from "react";

export function MovementForm({ onSubmit }: { onSubmit: (input: { type: "ENTRY" | "EXIT"; quantity: number }) => Promise<void> }) {
  const [type, setType] = useState<"ENTRY" | "EXIT">("ENTRY");
  const [quantity, setQuantity] = useState(1);
  return <form onSubmit={(event) => { event.preventDefault(); void onSubmit({ type, quantity }); }}>
    <label>Tipo<select value={type} onChange={(event) => setType(event.target.value as "ENTRY" | "EXIT")}><option value="ENTRY">Entrada</option><option value="EXIT">Salida</option></select></label>
    <label>Cantidad<input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label>
    <button type="submit">Registrar movimiento</button>
  </form>;
}
