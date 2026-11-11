import { useState } from "react";
import { CatalogPage } from "./pages/CatalogPage";
import { LowStockPage } from "./pages/LowStockPage";
import { MovementsPage } from "./pages/MovementsPage";

type Page = "catalog" | "movements" | "low-stock";

export default function App() {
  const [page, setPage] = useState<Page>("catalog");
  const navClass = (target: Page) => `nav-link ${page === target ? "nav-link-active" : ""}`;

  return (
    <main className="app-shell">
      <nav aria-label="Secciones" className="mb-6 flex flex-wrap gap-2 rounded-xl bg-white p-2 shadow-sm">
        <button className={navClass("catalog")} type="button" onClick={() => setPage("catalog")}>Catálogo</button>
        <button className={navClass("movements")} type="button" onClick={() => setPage("movements")}>Movimientos</button>
        <button className={navClass("low-stock")} type="button" onClick={() => setPage("low-stock")}>Stock bajo</button>
      </nav>
      {page === "catalog" && <CatalogPage />}
      {page === "movements" && <MovementsPage />}
      {page === "low-stock" && <LowStockPage />}
    </main>
  );
}
