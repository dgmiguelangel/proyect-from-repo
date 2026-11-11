# Tareas: Control de stock

**Entrada**: Documentos de diseño en `specs/001-stock-control/`.

**Pruebas**: Obligatorias por la constitución. Escribir cada prueba en rojo antes de la
implementación correspondiente.

## Fase 1: Configuración compartida

**Propósito**: Inicializar el monorepo TypeScript y las herramientas de ejecución y pruebas.

- [X] T001 Crear workspaces, scripts raíz y configuración TypeScript en `package.json` y `tsconfig.json`
- [X] T002 [P] Configurar dependencias y scripts de Express, Zod, better-sqlite3 y Vitest en `backend/package.json`
- [X] T003 [P] Configurar React, Vite, Tailwind CSS y Testing Library en `frontend/package.json`
- [X] T004 [P] Configurar Vitest para backend en `backend/vitest.config.ts`
- [X] T005 [P] Configurar Vitest, jsdom y Testing Library para frontend en `frontend/vitest.config.ts`

---

## Fase 2: Fundamentos bloqueantes

**Propósito**: Preparar persistencia, aplicación HTTP, contrato de errores y cliente compartido.

**CRÍTICO**: No comenzar las historias de usuario hasta completar esta fase.

- [X] T006 Crear tablas SQLite de productos y movimientos con `UNIQUE`, `CHECK` y `ON DELETE RESTRICT` en `db/migrations/001_initial_schema.sql`
- [X] T007 Crear conexión SQLite con `PRAGMA foreign_keys = ON`, migraciones y `STOCK_DB_PATH` en `backend/src/db/database.ts`
- [X] T008 Crear tipos `Product`, `Movement` y `MovementType` en `backend/src/types/domain.ts`
- [X] T009 Crear `AppError` y middleware Express con `{ error: { code, message, details? } }` en `backend/src/api/errors.ts`
- [X] T010 Crear `createApp(db?)`, middleware JSON y montaje de rutas en `backend/src/app.ts`
- [X] T011 Crear fábrica de aplicaciones SQLite en memoria para pruebas en `backend/tests/test-app.ts`
- [X] T012 Crear cliente HTTP y `ClientError` para el contrato de errores en `frontend/src/services/api.ts`
- [X] T013 Crear navegación local entre Catálogo, Movimientos y Stock bajo en `frontend/src/App.tsx`

**Punto de control**: Base de datos, aplicación, errores y cliente HTTP disponibles para todas
las historias.

---

## Fase 3: Historia de usuario 1 - Gestionar catálogo de productos (P1) MVP

**Objetivo**: Crear, consultar, modificar y eliminar productos sin movimientos, incluidos los
restablecimientos locales del formulario.

**Prueba independiente**: Crear un producto, localizarlo, modificarlo y eliminarlo si no tiene
movimientos; comprobar que el catálogo refleja cada operación y que Limpiar o Cancelar no lo
modifican.

### Pruebas de la historia de usuario 1

- [X] T014 [P] [US1] Escribir pruebas de contrato para crear, listar y obtener productos en `backend/tests/products.catalog.contract.test.ts`
- [X] T015 [P] [US1] Escribir pruebas de contrato para actualizar, eliminar y rechazar conflictos de productos en `backend/tests/products.mutation.contract.test.ts`
- [X] T016 [P] [US1] Escribir pruebas React de catálogo, búsqueda, alta, edición, eliminación, Limpiar y Cancelar en `frontend/tests/catalog-page.test.tsx`

### Implementación de la historia de usuario 1

- [X] T017 [US1] Implementar repositorio de productos con lista ordenada por `code` en `backend/src/models/product-repository.ts`
- [X] T018 [US1] Implementar esquema Zod: `code`, `name` y `description` “Obligatorio, no vacío”; `price` y `minimumStock` “mayor o igual que cero” en `backend/src/api/product-schemas.ts`
- [X] T019 [US1] Implementar servicio de productos con saldo inicial `quantityAvailable = 0`, código único y edición sin cambio de código en `backend/src/services/product-service.ts`
- [X] T020 [US1] Implementar `POST /products`, `GET /products`, `GET /products/:code`, `PATCH /products/:code` y `DELETE /products/:code` en `backend/src/api/product-routes.ts`
- [X] T021 [P] [US1] Implementar tabla de catálogo con código, precio, saldo, mínimo y acciones en `frontend/src/components/ProductTable.tsx`
- [X] T022 [US1] Implementar formulario: código, nombre y descripción “Obligatorio, no vacío”; precio y stock mínimo “mayor o igual que cero”; código no editable en edición; Limpiar solo en alta restablece textos vacíos y números a `0` en `frontend/src/components/ProductForm.tsx`
- [X] T023 [US1] Implementar restablecimiento de edición a valores persistidos y Cancelar exclusivo de edición que abandona la selección sin solicitudes HTTP en `frontend/src/components/ProductForm.tsx`
- [X] T024 [US1] Integrar búsqueda por código, vaciado de búsqueda al mostrar catálogo, edición, confirmación de eliminación, errores y cancelación de edición en `frontend/src/pages/CatalogPage.tsx`

**Punto de control**: La historia rechaza campos vacíos, valores negativos y códigos duplicados;
un producto con movimientos se rechazará al eliminarse tras completar US2.

---

## Fase 4: Historia de usuario 2 - Registrar movimientos de mercadería (P1)

**Objetivo**: Registrar entradas y salidas atómicas, impedir saldo negativo y consultar historial.

**Prueba independiente**: Buscar un producto, registrar una entrada y una salida, y comprobar que
saldo e historial coinciden; una salida excesiva no cambia ninguna información.

### Pruebas de la historia de usuario 2

- [X] T025 [P] [US2] Escribir pruebas de contrato para entrada, salida, producto inexistente y `INSUFFICIENT_STOCK` en `backend/tests/movements.contract.test.ts`
- [X] T026 [P] [US2] Escribir prueba de integración para atomicidad y saldo después de 100 movimientos en `backend/tests/movements.integration.test.ts`
- [X] T027 [P] [US2] Escribir pruebas React de búsqueda, registro, historial y error de stock insuficiente en `frontend/tests/movements-page.test.tsx`

### Implementación de la historia de usuario 2

- [X] T028 [US2] Implementar repositorio append-only de movimientos y consulta cronológica en `backend/src/models/movement-repository.ts`
- [X] T029 [US2] Implementar esquema Zod donde `type` es `ENTRY` o `EXIT` y `quantity` es “Obligatorio y estrictamente positivo” en `backend/src/api/movement-schemas.ts`
- [X] T030 [US2] Implementar transacción SQLite que actualiza saldo e inserta el movimiento todo-o-nada, sin permitir saldo negativo, en `backend/src/services/movement-service.ts`
- [X] T031 [US2] Impedir la eliminación de productos con movimientos en `backend/src/services/product-service.ts`
- [X] T032 [US2] Implementar `GET` y `POST /products/:code/movements` y sus errores de contrato en `backend/src/api/movement-routes.ts`
- [X] T033 [P] [US2] Implementar formulario de entrada y salida en `frontend/src/components/MovementForm.tsx`
- [X] T034 [P] [US2] Implementar historial con fecha, tipo y cantidad en `frontend/src/components/MovementHistory.tsx`
- [X] T035 [US2] Integrar búsqueda de producto, saldo, movimientos, historial y mensajes de error en `frontend/src/pages/MovementsPage.tsx`

**Punto de control**: Una salida igual al saldo deja cero; una salida mayor devuelve
`INSUFFICIENT_STOCK` sin modificar saldo ni historial.

---

## Fase 5: Historia de usuario 3 - Identificar stock bajo (P2)

**Objetivo**: Mostrar productos cuya cantidad disponible sea menor o igual al stock mínimo.

**Prueba independiente**: Con productos por debajo, en y sobre su mínimo, el listado contiene
solo los dos primeros; sin resultados muestra el mensaje definido.

### Pruebas de la historia de usuario 3

- [X] T036 [P] [US3] Escribir prueba de contrato para `GET /products/low-stock` y el filtro `quantityAvailable <= minimumStock` en `backend/tests/low-stock.contract.test.ts`
- [X] T037 [P] [US3] Escribir prueba React de resultados y estado vacío de stock bajo en `frontend/tests/low-stock-page.test.tsx`

### Implementación de la historia de usuario 3

- [X] T038 [US3] Implementar consulta ordenada de productos con `quantityAvailable <= minimumStock` en `backend/src/models/product-repository.ts`
- [X] T039 [US3] Implementar `GET /products/low-stock` antes de la ruta parametrizada en `backend/src/api/product-routes.ts`
- [X] T040 [US3] Implementar tabla de código, nombre, cantidad disponible y stock mínimo en `frontend/src/components/LowStockTable.tsx`
- [X] T041 [US3] Integrar consulta y mensaje “No hay productos con stock bajo.” en `frontend/src/pages/LowStockPage.tsx`

**Punto de control**: La UI lista exactamente los productos que alcanzaron o bajaron de su
mínimo.

---

## Fase 6: Pulido y validación transversal

**Propósito**: Alinear contratos, estilos y puertas de calidad.

- [X] T042 [P] Alinear respuestas HTTP y códigos de error con `specs/001-stock-control/contracts/openapi.yaml` en `backend/src/api`
- [X] T043 [P] Aplicar Tailwind y estilos compartidos a controles, tablas, alertas y foco visible en `frontend/src/index.css`
- [X] T044 Ejecutar el escenario de `specs/001-stock-control/quickstart.md` y `npm run test:backend`, `npm run test:frontend` y `npm run build` desde `package.json`
- [X] T045 Registrar el estado verificado de la implementación en `memory-bank/activeContext.md` y `memory-bank/progress.md`

---

## Dependencias y orden de ejecución

### Dependencias de fases

- **Fase 1**: No tiene dependencias.
- **Fase 2**: Depende de la Fase 1 y bloquea todas las historias.
- **US1**: Depende de la Fase 2; es el MVP.
- **US2**: Depende de US1 porque requiere productos existentes.
- **US3**: Depende de US1; usa movimientos de US2 para validar casos de saldo.
- **Fase 6**: Depende de las historias completadas.

### Orden de historias

`Configuración → Fundamentos → US1 (MVP) → US2 → US3 → Pulido`

### Dependencias dentro de cada historia

- Escribir y ejecutar en rojo las pruebas antes de la implementación.
- Implementar repositorios antes de servicios, servicios antes de rutas y rutas antes de
  integración de la UI.
- No modificar el mismo archivo en paralelo.

## Oportunidades de paralelismo

- T002–T005 pueden ejecutarse en paralelo después de T001.
- T014–T016, T021 con la parte visual de T022, y T025–T027 pueden distribuirse entre personas.
- T033–T034 y T036–T037 afectan archivos distintos y pueden ejecutarse en paralelo.
- T042–T043 pueden ejecutarse en paralelo después de las historias.

## Ejemplos de paralelismo

### US1

```text
T014: backend/tests/products.catalog.contract.test.ts
T015: backend/tests/products.mutation.contract.test.ts
T016: frontend/tests/catalog-page.test.tsx
```

### US2

```text
T025: backend/tests/movements.contract.test.ts
T026: backend/tests/movements.integration.test.ts
T027: frontend/tests/movements-page.test.tsx
```

## Estrategia de implementación

### MVP primero

1. Completar las fases 1 y 2.
2. Completar US1 y sus pruebas.
3. Validar la gestión de catálogo de forma independiente.

### Entrega incremental

1. Añadir US2 para obtener un libro mayor y saldo fiable.
2. Añadir US3 para la alerta de reposición.
3. Ejecutar la validación transversal antes de cerrar la feature.

## Validación de formato

Las 45 tareas usan el formato obligatorio: casilla, ID secuencial, marcador `[P]` solo cuando
corresponde, etiqueta de historia en fases de historia y ruta de archivo exacta.

## Phase 7: Convergence

- [X] T046 Resolver la contradicción entre FR-014/US1/AC7 y `specs/001-stock-control/contracts/product-form.md`; enmendar el artefacto que no represente el comportamiento acordado y alinear `frontend/src/components/ProductForm.tsx` y `frontend/tests/catalog-page.test.tsx` (contradicts)
- [X] T047 Vaciar `searchCode` al seleccionar “Mostrar catálogo” y añadir la prueba de regresión en `frontend/src/pages/CatalogPage.tsx` y `frontend/tests/catalog-page.test.tsx` per FR-016 y US1/AC3 (partial)
