# Tareas: Control de stock

**Entrada**: Documentos de diseño en `specs/001-stock-control/`

**Prerrequisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/openapi.yaml` y `quickstart.md`.

**Pruebas**: Obligatorias por la constitución. Cada prueba se escribe y se verifica en rojo antes
de implementar la tarea correspondiente.

## Fase 1: Configuración compartida

**Propósito**: Inicializar el monorepo y los proyectos TypeScript.

- [X] T001 Crear workspaces, scripts raíz y configuración TypeScript en `package.json` y `tsconfig.json`
- [X] T002 [P] Inicializar dependencias y scripts del backend en `backend/package.json`
- [X] T003 [P] Inicializar React, Vite, Tailwind y scripts del frontend en `frontend/package.json`
- [X] T004 [P] Configurar pruebas de backend en `backend/vitest.config.ts`
- [X] T005 [P] Configurar pruebas de frontend en `frontend/vitest.config.ts`

---

## Fase 2: Fundamentos bloqueantes

**Propósito**: Preparar persistencia, aplicación HTTP, contrato de errores y cliente compartido.

**CRÍTICO**: No comenzar historias de usuario hasta completar esta fase.

- [X] T006 Crear migración de productos y movimientos con `UNIQUE`, `CHECK` y `ON DELETE RESTRICT` en `db/migrations/001_initial_schema.sql`
- [X] T007 Crear conexión SQLite con `PRAGMA foreign_keys = ON`, migraciones y `STOCK_DB_PATH` en `backend/src/db/database.ts`
- [X] T008 Crear tipos de dominio `Product`, `Movement` y `MovementType` en `backend/src/types/domain.ts`
- [X] T009 Crear errores de dominio y middleware Express con `{ error: { code, message, details? } }` en `backend/src/api/errors.ts`
- [X] T010 Crear `createApp(db?)`, JSON middleware y montaje de rutas en `backend/src/app.ts`
- [X] T011 Crear cliente HTTP `ClientError` que interprete el formato de error estable en `frontend/src/services/api.ts`

**Punto de control**: Base de datos, aplicación y manejo de errores disponibles para todas las
historias.

---

## Fase 3: Historia de usuario 1 - Gestionar catálogo de productos (P1) MVP

**Objetivo**: Crear, consultar, modificar y eliminar productos sin movimientos.

**Prueba independiente**: Crear un producto, localizarlo en catálogo, modificarlo y eliminarlo
si no tiene movimientos; el catálogo final debe reflejar cada operación.

### Pruebas de la historia de usuario 1

- [X] T012 [P] [US1] Escribir pruebas de contrato para `POST`, `GET` y `GET /:code` de productos en `backend/tests/products.catalog.contract.test.ts`
- [X] T013 [P] [US1] Escribir pruebas de contrato para `PATCH` y `DELETE /products/:code` en `backend/tests/products.mutation.contract.test.ts`
- [X] T014 [P] [US1] Escribir pruebas React del catálogo y formulario de producto en `frontend/tests/catalog-page.test.tsx`

### Implementación de la historia de usuario 1

- [X] T015 [US1] Implementar repositorio de productos ordenado por `code` en `backend/src/models/product-repository.ts`
- [X] T016 [US1] Implementar validación Zod de producto: `code`, `name` y `description` “Obligatorio, no vacío”; `price` y `minimumStock` “mayor o igual que cero” en `backend/src/api/product-schemas.ts`
- [X] T017 [US1] Implementar servicio de catálogo con saldo inicial `quantityAvailable = 0`, código único y edición sin cambio de código en `backend/src/services/product-service.ts`
- [X] T018 [US1] Implementar rutas `POST /products`, `GET /products`, `GET /products/:code`, `PATCH /products/:code` y `DELETE /products/:code` en `backend/src/api/product-routes.ts`
- [X] T019 [US1] Implementar estado local y navegación de Catálogo en `frontend/src/App.tsx`
- [X] T020 [P] [US1] Implementar lista ordenada de catálogo en `frontend/src/components/ProductTable.tsx`
- [X] T021 [P] [US1] Implementar formulario de alta y edición sin campo editable de código en `frontend/src/components/ProductForm.tsx`
- [X] T022 [US1] Integrar detalle, confirmación de eliminación y mensajes de error en `frontend/src/pages/CatalogPage.tsx`

**Punto de control**: La historia funciona de forma independiente y rechaza campos vacíos,
precios o stocks mínimos negativos y códigos duplicados.

---

## Fase 4: Historia de usuario 2 - Registrar movimientos de mercadería (P1)

**Objetivo**: Registrar entradas y salidas atómicas, impedir saldo negativo y consultar historial.

**Prueba independiente**: Buscar un producto, registrar una entrada y una salida, y comprobar que
saldo e historial coinciden; una salida excesiva no cambia ninguna información.

### Pruebas de la historia de usuario 2

- [X] T023 [P] [US2] Escribir pruebas de contrato para entrada, salida, stock insuficiente y producto inexistente en `backend/tests/movements.contract.test.ts`
- [X] T024 [P] [US2] Escribir prueba de integración de atomicidad y saldo tras 100 movimientos en `backend/tests/movements.integration.test.ts`
- [X] T025 [P] [US2] Escribir pruebas React de búsqueda, formulario e historial de movimientos en `frontend/tests/movements-page.test.tsx`

### Implementación de la historia de usuario 2

- [X] T026 [US2] Implementar repositorio append-only de movimientos y consulta cronológica en `backend/src/models/movement-repository.ts`
- [X] T027 [US2] Implementar validación Zod de movimientos: `type` es `ENTRY` o `EXIT` y `quantity` es “Obligatorio y estrictamente positivo” en `backend/src/api/movement-schemas.ts`
- [X] T028 [US2] Implementar transacción SQLite que inserta el movimiento y actualiza saldo todo-o-nada en `backend/src/services/movement-service.ts`
- [X] T029 [US2] Implementar rutas `GET` y `POST /products/:code/movements`, incluido `INSUFFICIENT_STOCK`, en `backend/src/api/movement-routes.ts`
- [X] T030 [P] [US2] Implementar formulario de entrada y salida en `frontend/src/components/MovementForm.tsx`
- [X] T031 [P] [US2] Implementar historial con fecha, tipo y cantidad en `frontend/src/components/MovementHistory.tsx`
- [X] T032 [US2] Integrar búsqueda por código, movimientos e historial en `frontend/src/pages/MovementsPage.tsx`

**Punto de control**: Una salida igual al saldo deja cero; una salida mayor devuelve
`INSUFFICIENT_STOCK` sin modificar saldo ni historial.

---

## Fase 5: Historia de usuario 3 - Identificar stock bajo (P2)

**Objetivo**: Mostrar productos cuya cantidad disponible sea menor o igual al stock mínimo.

**Prueba independiente**: Con productos por debajo, en y sobre su mínimo, el listado contiene
solo los dos primeros; sin resultados muestra el mensaje definido.

### Pruebas de la historia de usuario 3

- [X] T033 [P] [US3] Escribir prueba de contrato para `GET /products/low-stock` y el filtro `quantityAvailable <= minimumStock` en `backend/tests/low-stock.contract.test.ts`
- [X] T034 [P] [US3] Escribir prueba React de lista y estado vacío de stock bajo en `frontend/tests/low-stock-page.test.tsx`

### Implementación de la historia de usuario 3

- [X] T035 [US3] Implementar consulta de productos con `quantityAvailable <= minimumStock` en `backend/src/models/product-repository.ts`
- [X] T036 [US3] Implementar ruta `GET /products/low-stock` antes de la ruta parametrizada en `backend/src/api/product-routes.ts`
- [X] T037 [US3] Implementar tabla de código, nombre, cantidad disponible y stock mínimo en `frontend/src/components/LowStockTable.tsx`
- [X] T038 [US3] Integrar consulta y mensaje “No hay productos con stock bajo.” en `frontend/src/pages/LowStockPage.tsx`

**Punto de control**: La UI lista exactamente los productos que alcanzaron o bajaron de su
mínimo.

---

## Fase 6: Pulido y validación transversal

**Propósito**: Verificar los contratos, guía de uso y puertas de calidad.

- [X] T039 [P] Alinear las respuestas HTTP y códigos de error con `specs/001-stock-control/contracts/openapi.yaml` en `backend/src/api`
- [X] T040 Ejecutar el escenario de `specs/001-stock-control/quickstart.md` y `npm run test:backend`, `npm run test:frontend` y `npm run build` desde `package.json`

---

## Fase 7: Incorporar Tailwind CSS y estilos del frontend

**Propósito**: Configurar Tailwind CSS 3 y aplicar estilos responsivos sin modificar contratos,
validaciones ni reglas de inventario existentes.

### Configuración compartida

- [X] T041 Añadir `tailwindcss@3`, `postcss` y `autoprefixer` como dependencias de desarrollo en `frontend/package.json`
- [X] T042 [P] Configurar el escaneo de `frontend/index.html` y `frontend/src/**/*.tsx` en `frontend/tailwind.config.cjs`
- [X] T043 [P] Configurar los plugins Tailwind CSS y Autoprefixer en `frontend/postcss.config.cjs`
- [X] T044 Crear directivas Tailwind y clases compartidas para controles, tablas, alertas, estados vacíos y foco visible en `frontend/src/index.css`
- [X] T045 Importar `frontend/src/index.css` y aplicar el contenedor, navegación responsiva y estado activo en `frontend/src/main.tsx` y `frontend/src/App.tsx`

### Historia de usuario 1 - Gestionar catálogo de productos (P1)

**Objetivo**: Hacer legible y operable el catálogo, formulario y acciones en pantallas pequeñas
y grandes, preservando todos los flujos existentes.

**Prueba independiente**: El catálogo conserva su encabezado, sus controles accesibles y las
operaciones existentes después de aplicar Tailwind.

- [X] T046 [US1] Extender en rojo las expectativas de controles accesibles del catálogo en `frontend/tests/catalog-page.test.tsx`
- [X] T047 [US1] Aplicar diseño de página, encabezado y alerta del catálogo en `frontend/src/pages/CatalogPage.tsx`
- [X] T048 [P] [US1] Aplicar clases Tailwind a etiquetas, campos, código deshabilitado y botón del formulario en `frontend/src/components/ProductForm.tsx`
- [X] T049 [P] [US1] Aplicar tabla responsiva y acciones de editar/eliminar en `frontend/src/components/ProductTable.tsx`
- [X] T050 [US1] Ejecutar y verificar la prueba de catálogo en `frontend/tests/catalog-page.test.tsx`

### Historia de usuario 2 - Registrar movimientos de mercadería (P1)

**Objetivo**: Mostrar de manera clara la búsqueda, saldo, formulario e historial de movimientos
sin cambiar su semántica.

**Prueba independiente**: La búsqueda, la entrada o salida válida y los mensajes de rechazo
siguen siendo accesibles con el diseño Tailwind.

- [X] T051 [US2] Extender en rojo las expectativas de navegación y formulario de movimientos en `frontend/tests/movements-page.test.tsx`
- [X] T052 [US2] Aplicar diseño de búsqueda, saldo, alerta y distribución de la página en `frontend/src/pages/MovementsPage.tsx`
- [X] T053 [P] [US2] Aplicar clases Tailwind al selector de tipo, cantidad y acción de registro en `frontend/src/components/MovementForm.tsx`
- [X] T054 [P] [US2] Aplicar tabla responsiva al historial cronológico en `frontend/src/components/MovementHistory.tsx`
- [X] T055 [US2] Ejecutar y verificar la prueba de movimientos en `frontend/tests/movements-page.test.tsx`

### Historia de usuario 3 - Identificar stock bajo (P2)

**Objetivo**: Facilitar la lectura de productos con stock bajo y del estado vacío.

**Prueba independiente**: La pantalla conserva su encabezado y presenta la tabla o el mensaje
“No hay productos con stock bajo.” con el diseño Tailwind.

- [X] T056 [US3] Extender en rojo las expectativas del estado vacío de stock bajo en `frontend/tests/low-stock-page.test.tsx`
- [X] T057 [US3] Aplicar diseño de página, encabezado y alerta en `frontend/src/pages/LowStockPage.tsx`
- [X] T058 [US3] Aplicar tabla responsiva y estado vacío en `frontend/src/components/LowStockTable.tsx`
- [X] T059 [US3] Ejecutar y verificar la prueba de stock bajo en `frontend/tests/low-stock-page.test.tsx`

### Validación transversal

- [X] T060 [P] Ejecutar la suite de frontend tras incorporar Tailwind con `npm run test:frontend` desde `package.json`
- [X] T061 [P] Ejecutar type-check y compilación de producción con `npm run build` desde `package.json`
- [X] T062 Ejecutar la validación visual de Tailwind indicada en `specs/001-stock-control/quickstart.md`

---

## Dependencias y orden de ejecución

### Dependencias de fases

- La Fase 1 no depende de otras tareas.
- La Fase 2 depende de completar la Fase 1 y bloquea todas las historias.
- Las historias US1 y US2 son P1, pero US2 requiere el producto y rutas base de US1 para ser
  utilizable; ejecutar US1 antes de US2.
- US3 depende de los productos y movimientos realizados por US1 y US2.
- La Fase 6 depende de las tres historias.
- La Fase 7 depende de la validación previa y T041; T044 depende de T042 y T043; T045 depende
  de T044. Las tareas de cada historia de la Fase 7 dependen de T045.

### Orden de historias

`Configuración → Fundamentos → US1 (MVP) → US2 → US3 → Pulido → Tailwind CSS`

### Dependencias dentro de cada historia

- Escribir y ejecutar en rojo las pruebas antes de la implementación.
- Implementar repositorios antes de servicios, servicios antes de rutas y rutas antes de
  integración de la UI.
- No modificar el mismo archivo en paralelo.

## Oportunidades de paralelismo

- T002–T005 pueden ejecutarse en paralelo después de T001.
- T012–T014, T020–T021, T023–T025, T030–T031 y T033–T034 pueden distribuirse entre personas.
- T042–T043 pueden ejecutarse en paralelo tras T041; T048–T049 y T053–T054 pueden hacerlo
  después de las pruebas de su historia.
- Las tareas marcadas `[P]` afectan archivos distintos y no comparten una dependencia pendiente.

## Ejemplo de paralelismo: US1

```text
T012: backend/tests/products.catalog.contract.test.ts
T013: backend/tests/products.mutation.contract.test.ts
T014: frontend/tests/catalog-page.test.tsx
```

Tras implementar el servicio y las rutas, T020 y T021 pueden ejecutarse en paralelo.

## Estrategia de implementación

### MVP primero

1. Completar las fases 1 y 2.
2. Completar US1 y sus pruebas.
3. Validar la gestión de catálogo de forma independiente.

### Entrega incremental

1. Añadir US2 para obtener un libro mayor y saldo fiable.
2. Añadir US3 para la alerta de reposición.
3. Incorporar Tailwind CSS para estilizar las tres historias sin alterar su comportamiento.
4. Ejecutar la validación transversal antes de cerrar la feature.

## Phase 8: Convergence

- [X] T063 Add catalog product-code lookup and its not-found feedback in `frontend/src/pages/CatalogPage.tsx` per US1/AC3 and FR-003 (partial)
- [X] T064 Add red-green frontend tests for creating, editing, deleting, and displaying catalog errors in `frontend/tests/catalog-page.test.tsx` per T014 and Constitution III (partial)
- [X] T065 Add red-green frontend tests for product lookup, entries, exits, history, and insufficient-stock feedback in `frontend/tests/movements-page.test.tsx` per T025 and Constitution III (partial)
- [X] T066 Add red-green frontend tests for populated and empty low-stock states in `frontend/tests/low-stock-page.test.tsx` per T034 and Constitution III (partial)
