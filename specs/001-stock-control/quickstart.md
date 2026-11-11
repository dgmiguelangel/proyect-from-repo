# Guía de validación rápida

## Requisitos

- Node.js 22 LTS y npm.
- Dependencias instaladas desde la raíz con `npm install`.

## Validación automatizada

Ejecutar desde la raíz:

```powershell
npm run test:backend
npm run test:frontend
npm run build
```

Los tres comandos deben finalizar correctamente. Las pruebas de backend usan SQLite en memoria y
no alteran la base local.

## Validación de estilos

Al iniciar el frontend, confirmar que las páginas y componentes cargan las utilidades de Tailwind
CSS desde la hoja global, sin errores de compilación de Vite.

## Escenario de aceptación

1. Iniciar backend y frontend con `npm run dev:backend` y `npm run dev:frontend`.
2. Crear un producto con código único, precio y stock mínimo válidos. Confirmar que su cantidad
   disponible es `0`.
3. Registrar una entrada y una salida válida; comprobar el saldo y el historial de movimientos.
4. Intentar una salida mayor al saldo; confirmar que recibe el error de stock insuficiente, sin
   cambio de saldo ni movimiento nuevo.
5. Consultar stock bajo; comprobar que lista exactamente los productos definidos en la vista
   derivada de [data-model.md](./data-model.md).
6. Intentar eliminar un producto con movimientos; comprobar que la API informa el conflicto.
7. Mientras se crea un producto, completar todos los campos y seleccionar “Limpiar”; comprobar
   que los textos quedan vacíos, los valores numéricos vuelven a cero y el catálogo no cambia.
8. Seleccionar “Editar” sobre un producto, cambiar nombre, descripción, precio y stock mínimo,
   y seleccionar “Limpiar”; comprobar que los campos recuperan los valores guardados y que no
   se realiza ninguna actualización del catálogo.
9. Mientras se edita un producto, cambiar campos y seleccionar “Cancelar”; comprobar que se
   muestra el formulario de alta vacío y que no se realiza ninguna actualización del catálogo.

Las rutas, formatos de solicitudes y códigos de error se definen en
[contracts/openapi.yaml](./contracts/openapi.yaml); el comportamiento local del formulario se
define en [contracts/product-form.md](./contracts/product-form.md).
