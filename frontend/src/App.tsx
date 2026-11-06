import { useState } from "react";
import { CatalogPage } from "./pages/CatalogPage";
import { LowStockPage } from "./pages/LowStockPage";
import { MovementsPage } from "./pages/MovementsPage";

type Page = "catalog" | "movements" | "low-stock";

export default function App() {
  const [page, setPage] = useState<Page>("catalog");
  return <main><nav><button onClick={() => setPage("catalog")}>Catálogo</button><button onClick={() => setPage("movements")}>Movimientos</button><button onClick={() => setPage("low-stock")}>Stock bajo</button></nav>
    {page === "catalog" && <CatalogPage />}{page === "movements" && <MovementsPage />}{page === "low-stock" && <LowStockPage />}</main>;
}
