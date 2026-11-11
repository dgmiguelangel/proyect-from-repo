# Contexto tecnológico

## Frontend
- React 19
- TypeScript 5.x
- Tailwind CSS
- Vite

## Backend
- Node.js 22 LTS
- Express 5
- TypeScript 5.x
- Zod (validación de parámetros y cuerpos de request)

## Base de datos
- SQLite local en `db/stock.db`
- better-sqlite3 (SQL parametrizado, acceso síncrono)
- Claves foráneas habilitadas en cada conexión

## Pruebas
- Backend: Vitest + Supertest con SQLite en memoria
- Frontend: Vitest + React Testing Library

## Estructura del repositorio
- `/frontend` (UI React), `/backend` (rutas HTTP, servicios, acceso a datos), `/db` (migraciones y `stock.db`)

## Metodología
- Spec Driven Development
- Git y GitHub
- GitHub Copilot

## Decisiones técnicas (plan 001-stock-control)
- Inventario: `quantityAvailable` almacenado + libro mayor de movimientos inmutable (append-only); ambos se actualizan en una única transacción SQLite (`db.transaction()`), todo-o-nada.
- La cantidad solo cambia mediante movimientos (`ENTRY`/`EXIT`); no existe edición directa de stock. `quantityAvailable` inicia en 0 al crear el producto.
- Un `EXIT` solo es válido si no supera la cantidad disponible (nunca stock negativo).
- Un producto solo puede eliminarse si no tiene movimientos; de lo contrario la API devuelve conflicto sin modificar datos.
- Semántica HTTP de errores: `400` entrada inválida, `404` producto desconocido, `409` código duplicado o stock insuficiente.
- Errores JSON centralizados en Express con código estable y mensaje legible para la UI.
- Se rechazó ORM (esquema pequeño y estable) y driver async de SQLite (un solo administrador, sin concurrencia de escritura).
- Stock bajo: `quantityAvailable <= minimumStock`.

## Organización de la implementación (tasks.md)
- 40 tareas en 6 fases: Setup, Foundational, US1 Catálogo (P1, MVP), US2 Movimientos (P1), US3 Stock bajo (P2), Polish.
- Pruebas incluidas por historia (Supertest/Vitest en backend, React Testing Library en frontend), escritas antes de la implementación.
- US2 y US3 pueden implementarse en paralelo una vez completada US1.