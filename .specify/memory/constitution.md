# Control de Stock Constitution

<!-- Sync Impact Report
Version change: N/A (plantilla sin ratificar) → 1.0.0
Modified principles: N/A — ratificación inicial derivada del código construido en github.com/dgmiguelangel/stock
Added sections: Core Principles (I–V), Stack Tecnológico, Flujo de Desarrollo y Calidad, Governance
Removed sections: N/A
Follow-up TODOs: ninguno; este comentario es material de revisión temporal y debe eliminarse antes de commitear
-->

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

Todo cambio funcional DEBE partir de una especificación aprobada (`spec.md`) y seguir el flujo
Spec Kit: constitución → especificación → plan → tareas → implementación. Se DEBE implementar
únicamente lo definido en la especificación vigente; cualquier desviación exige enmendar primero
la especificación. Al finalizar cada tarea se DEBE actualizar el Memory Bank
(`memory-bank/activeContext.md` y `memory-bank/progress.md`) con el estado real verificado.

**Rationale**: El repositorio se construyó íntegramente con Spec Kit (`specs/001-stock-control`);
sin especificación no hay trazabilidad entre lo pedido y lo construido.

### II. Simplicidad y alcance mínimo (YAGNI)

La arquitectura DEBE mantenerse lo más sencilla posible: un único administrador, una sola base
SQLite local, sin ORM, sin autenticación ni gestión de usuarios, y sin librería de routing en el
frontend. NO se DEBEN agregar funcionalidades fuera del alcance aprobado: facturación, compras,
ventas, proveedores, clientes, pagos y múltiples depósitos quedan excluidos. Toda complejidad
adicional DEBE justificarse por escrito en el plan de la feature.

**Rationale**: Es una herramienta interna para un pequeño comercio; cada capa extra se paga en
mantenimiento sin aportar valor al administrador.

### III. Test-First (NON-NEGOTIABLE)

Las pruebas de cada historia de usuario DEBEN escribirse antes de la implementación y verse
fallar antes de codificar (ciclo Red-Green-Refactor). Backend: Vitest + Supertest contra SQLite
en memoria (`new Database(':memory:')` inyectada en `createApp`). Frontend: Vitest + React
Testing Library. Ninguna tarea se da por terminada sin pasar en verde `npm run test:backend`,
`npm run test:frontend` y `npm run build`.

**Rationale**: Las 40 tareas de `001-stock-control` se ejecutaron con pruebas por historia
escritas primero; es la garantía objetiva de que los invariantes de inventario se respetan.

### IV. Integridad de inventario

Las reglas de dominio son inviolables y DEBEN aplicarse en la capa de servicio/repositorio y
reforzarse con constraints SQL:

- El stock NUNCA puede ser negativo: una salida (`EXIT`) solo es válida si no supera la cantidad
  disponible; una salida exactamente igual a la disponible se acepta y deja el saldo en cero.
- La cantidad disponible SOLO cambia mediante movimientos (`ENTRY`/`EXIT`); no existe edición
  directa de stock y todo producto nuevo inicia con `quantityAvailable = 0`.
- Cada movimiento y la actualización de la cantidad DEBEN ejecutarse en una única transacción
  SQLite (`db.transaction()`), todo-o-nada; el libro mayor de movimientos es append-only.
- El código de producto es único; un producto con movimientos registrados NO puede eliminarse.
- Stock bajo se define como `quantityAvailable <= minimumStock`.

**Rationale**: El valor del sistema es la fiabilidad del saldo; una inconsistencia entre el
libro mayor y la cantidad almacenada destruye la confianza del administrador.

### V. Validación en el borde y errores claros

Toda entrada HTTP DEBE validarse con Zod en la capa de rutas antes de llegar a los servicios.
Los errores DEBEN centralizarse en el middleware de Express con el formato JSON estable
`{ error: { code, message, details? } }` y semántica HTTP consistente: `400` entrada inválida
(`VALIDATION_ERROR`), `404` recurso inexistente (`NOT_FOUND`/`PRODUCT_NOT_FOUND`), `409`
conflicto de negocio (`DUPLICATE_CODE`, `INSUFFICIENT_STOCK`, `PRODUCT_HAS_MOVEMENTS`). Los
mensajes DEBEN ser legibles, estar en castellano y no exponer detalles internos.

**Rationale**: La UI consume `error.code` y `error.message` directamente; un contrato de error
estable evita acoplar el frontend a textos cambiantes o a trazas internas.

## Stack Tecnológico

Stack fijado por esta constitución; cambiar versiones mayores o librerías centrales requiere
enmienda constitucional:

- **Monorepo**: npm workspaces con `/backend` (`@stock/backend`), `/frontend`
  (`@stock/frontend`) y `/db` (migraciones SQL y `stock.db`). Scripts raíz: `dev:backend`,
  `dev:frontend`, `test:backend`, `test:frontend`, `test`, `build`.
- **Backend**: Node.js 22 LTS, Express 5, TypeScript 5.x en ESM (`"type": "module"`), Zod 4 y
  better-sqlite3 (acceso síncrono con SQL parametrizado); tsx para desarrollo. Arquitectura en
  capas `api` (rutas + esquemas Zod) → `services` (reglas de negocio) → `models` (repositorios),
  con inyección de dependencias por constructor y `createApp(db?)` para pruebas.
- **Base de datos**: SQLite local en `db/stock.db` (sobreescribible con `STOCK_DB_PATH`),
  migraciones versionadas en `db/migrations/` y `PRAGMA foreign_keys = ON` en cada conexión.
  Las constraints SQL (UNIQUE, CHECK, `REFERENCES ... ON DELETE RESTRICT`) son la última línea
  de defensa de los invariantes.
- **Frontend**: React 19, TypeScript 5.x, Vite 7 y Tailwind CSS 3. Navegación por estado local
  entre las páginas Catálogo, Movimientos y Stock bajo. Cliente HTTP centralizado en
  `src/services/api.ts` con `ClientError`.
- **Configuración**: `PORT` (por defecto 3000) y `STOCK_DB_PATH` como únicas variables de
  entorno.
- **Metodología**: Spec Driven Development con Spec Kit, Git/GitHub y GitHub Copilot.

## Flujo de Desarrollo y Calidad

- **Protocolo Memory Bank**: antes de cualquier comando `/speckit-*` o tarea de desarrollo se
  DEBEN leer `memory-bank/projectbrief.md`, `techContext.md`, `activeContext.md`, `progress.md`
  y esta constitución; al terminar se DEBEN actualizar `activeContext.md` y `progress.md`
  (`techContext.md` solo ante nuevas decisiones técnicas; `projectbrief.md` solo si cambia el
  alcance). Ninguna tarea se considera finalizada sin esta verificación.
- **Puertas de calidad**: antes de cerrar trabajo DEBEN pasar `npm run test:backend`,
  `npm run test:frontend` y `npm run build` (incluye typecheck estricto de TypeScript).
- **Idioma**: documentación, mensajes de UI, mensajes de error y respuestas del asistente en
  castellano.
- **Control de versiones**: Git y GitHub; los cambios se revisan contra la especificación y
  esta constitución antes de versionarse.

## Governance

Esta constitución prevalece sobre cualquier otra práctica o preferencia del proyecto. Las
enmiendas DEBEN documentarse en el propio archivo, elevar la versión según versionado semántico
(MAJOR: eliminación o redefinición incompatible de principios; MINOR: nuevo principio o sección,
o guía materialmente expandida; PATCH: aclaraciones y correcciones sin cambio semántico) y
actualizar `LAST_AMENDED_DATE`. Toda revisión de código o PR DEBE verificar el cumplimiento de
los principios; la complejidad que viole el Principio II DEBE justificarse en el plan de la
feature. `.github/copilot-instructions.md` actúa como guía operativa en tiempo de desarrollo y
no puede contradecir esta constitución.

**Version**: 1.0.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
