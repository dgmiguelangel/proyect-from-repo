import { useState } from "react";

export function MovementForm({ onSubmit }: { onSubmit: (input: { type: "ENTRY" | "EXIT"; quantity: number }) => Promise<void> }) {
  const [type, setType] = useState<"ENTRY" | "EXIT">("ENTRY");
  const [quantity, setQuantity] = useState(1);
  return <form className="form-grid" onSubmit={(event) => { event.preventDefault(); void onSubmit({ type, quantity }); }}>
    <label className="field">Tipo<select className="text-input" value={type} onChange={(event) => setType(event.target.value as "ENTRY" | "EXIT")}><option value="ENTRY">Entrada</option><option value="EXIT">Salida</option></select></label>
    <label className="field">Cantidad<input className="text-input" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label>
    <button className="primary-button w-fit" type="submit">Registrar movimiento</button>
  </form>;
}
