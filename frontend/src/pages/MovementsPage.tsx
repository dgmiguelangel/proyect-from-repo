import { useState } from "react";
import { api, ClientError, type Movement, type Product } from "../services/api";
import { MovementForm } from "../components/MovementForm";
import { MovementHistory } from "../components/MovementHistory";

export function MovementsPage() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState<Product>();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [message, setMessage] = useState("");
  const load = async () => {
    try { const found = await api.product(code); setProduct(found); setMovements(await api.movements(code)); setMessage(""); }
    catch (error) { setProduct(undefined); setMovements([]); setMessage((error as ClientError).message); }
  };
  const register = async (input: { type: "ENTRY" | "EXIT"; quantity: number }) => {
    try { await api.createMovement(code, input); await load(); } catch (error) { setMessage((error as ClientError).message); }
  };
  return (
    <section className="page-card space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Movimientos</h1>
        <p className="mt-1 text-slate-600">Registra entradas y salidas de mercadería.</p>
      </div>
      <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={(event) => { event.preventDefault(); void load(); }}>
        <label className="field flex-1">Código
          <input className="text-input" value={code} onChange={(event) => setCode(event.target.value)} />
        </label>
        <button className="primary-button" type="submit">Buscar</button>
      </form>
      {message && <p className="alert" role="alert">{message}</p>}
      {product && (
        <>
          <p className="rounded-lg bg-sky-50 px-4 py-3 text-sky-900">
            <span className="font-semibold">{product.name}:</span> {product.quantityAvailable} disponibles
          </p>
          <MovementForm onSubmit={register} />
          <MovementHistory movements={movements} />
        </>
      )}
    </section>
  );
}
