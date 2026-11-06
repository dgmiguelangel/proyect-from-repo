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
  return <section><h1>Movimientos</h1><form onSubmit={(event) => { event.preventDefault(); void load(); }}><label>Código<input value={code} onChange={(event) => setCode(event.target.value)} /></label><button>Buscar</button></form>
    {message && <p role="alert">{message}</p>}{product && <><p>{product.name}: {product.quantityAvailable} disponibles</p><MovementForm onSubmit={register} /><MovementHistory movements={movements} /></>}</section>;
}
