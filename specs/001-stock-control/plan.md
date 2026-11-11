# Plan de implementación: Control de stock

**Rama**: `001-stock-control` | **Fecha**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Entrada**: Especificación de la aplicación de control de stock para un único administrador.

## Summary

Aplicación web local para administrar productos y sus existencias mediante un libro mayor
inmutable de entradas y salidas. Se implementa como monorepo npm con API Express/TypeScript,
SQLite y una interfaz React/Vite estilizada con Tailwind CSS; la API aplica reglas de inventario
dentro de transacciones y la interfaz consume un contrato HTTP estable.
Los formularios de alta y edición ofrecen acciones locales que no realizan solicitudes a la API
ni modifican el catálogo: alta vuelve a sus valores iniciales y cancelar abandona la edición para
mostrar el formulario de alta vacío.

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js 22 LTS para backend.

**Primary Dependencies**: Express 5, Zod 4, better-sqlite3; React 19, Vite 7 y Tailwind CSS 3.

**Storage**: SQLite local (`db/stock.db`) con migraciones SQL y claves foráneas habilitadas.

**Testing**: Vitest + Supertest con SQLite en memoria para backend; Vitest + React Testing
Library para frontend.

**Target Platform**: Aplicación web local ejecutada en un entorno con Node.js; navegador moderno.

**Project Type**: Aplicación web con frontend y backend.

**Performance Goals**: El administrador registra y vuelve a localizar un producto válido en menos
de un minuto; en series de al menos 100 movimientos, el saldo mostrado coincide con el libro
mayor.

**Constraints**: Un administrador, una instancia local, sin acceso concurrente, sin ORM ni
routing frontend; las operaciones de movimiento son atómicas y el stock nunca es negativo. El
botón Limpiar solo está disponible durante el alta y debe restablecer valores iniciales sin
enviar solicitudes. Cancelar edición debe descartar el estado local y deseleccionar el producto
sin enviar solicitudes.

**Scale/Scope**: Catálogo, movimientos e identificación de stock bajo para un comercio; se
excluyen facturación, compras, ventas, terceros, pagos y múltiples depósitos.

## Constitution Check

*Preinvestigación: APROBADO.* El diseño respeta el flujo Spec Kit, el alcance mínimo y el stack
fijado. La prueba de cancelación de edición se escribirá antes del cambio de interfaz. No hay
cambios de stock, persistencia ni API; las garantías existentes de transacciones SQLite,
validación Zod y formato de errores permanecen sin cambios.

*Postdiseño: APROBADO.* El diseño añade solo estado local de formulario y selección de edición,
y conserva el libro mayor append-only, restricciones SQL, actualización atómica de saldo y
códigos de error definidos. No se requiere justificar complejidad adicional.

## Project Structure

### Documentation (this feature)

```text
specs/001-stock-control/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── openapi.yaml
    └── product-form.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
├── tailwind.config.cjs
└── postcss.config.cjs
└── tests/

db/
└── migrations/
```

**Structure Decision**: Se adopta la estructura de aplicación web de la constitución:
`backend` separa rutas, servicios y repositorios; `frontend` separa páginas, componentes y
cliente HTTP, y configura Tailwind CSS para los estilos de páginas y componentes; `db` concentra
migraciones y la base local.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ninguna | No aplica | No aplica |
