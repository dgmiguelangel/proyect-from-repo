# Investigación: Control de stock

## Decisiones

### Stack y separación de responsabilidades

- **Decisión**: Usar npm workspaces con backend Express 5/TypeScript y frontend React 19/Vite,
  manteniendo `api` → `services` → `models` en el backend.
- **Justificación**: Es el stack y la estructura establecidos por la constitución; permiten
  aislar la validación HTTP de las reglas que protegen el inventario.
- **Alternativas consideradas**: Un único proceso con acceso directo desde la UI o un ORM. Se
  descartan porque contradicen la separación en capas y la restricción de no usar ORM.

### Persistencia e integridad de inventario

- **Decisión**: Usar SQLite con migraciones, claves foráneas activas, restricciones SQL y una
  transacción por movimiento que actualice el saldo e inserte el registro inmutable.
- **Justificación**: El saldo y el libro mayor deben cambiar todo-o-nada, y una salida nunca
  puede dejar el stock negativo.
- **Alternativas consideradas**: Calcular el saldo únicamente al consultar o actualizar saldo y
  movimiento en operaciones separadas. La primera no satisface el saldo almacenado requerido y
  la segunda permite inconsistencias.

### Validación y errores

- **Decisión**: Validar entradas HTTP con Zod en las rutas y centralizar errores en Express con
  `{ error: { code, message, details? } }`.
- **Justificación**: Conserva los mensajes en castellano, evita filtrar errores internos y da a
  React un contrato estable para mostrar rechazos.
- **Alternativas consideradas**: Validación solo en la UI o respuestas de error ad hoc. Ninguna
  protege las llamadas directas a la API ni mantiene compatibilidad de cliente.

### Pruebas y ejecución local

- **Decisión**: Probar backend con Vitest/Supertest y una base SQLite en memoria inyectada en
  `createApp`; probar frontend con Vitest y React Testing Library.
- **Justificación**: Hace reproducibles las reglas críticas de dominio y permite cumplir el
  ciclo Red-Green-Refactor sin tocar `db/stock.db`.
- **Alternativas consideradas**: Pruebas manuales únicamente o usar la base local en pruebas.
  La primera no prueba invariantes y la segunda introduce estado compartido y no determinista.

### Estilos del frontend

- **Decisión**: Incorporar Tailwind CSS 3 al frontend de Vite mediante la configuración de
  PostCSS y directivas en la hoja global; los componentes y páginas usarán sus utilidades para
  definir la presentación.
- **Justificación**: Tailwind CSS es el sistema de estilos fijado por la constitución y permite
  mantener estilos consistentes sin añadir una librería de componentes ni ampliar el alcance.
- **Alternativas consideradas**: CSS manual por componente o una librería de UI. El primero no
  cumple la decisión de usar Tailwind y el segundo introduce dependencias y patrones de diseño
  no requeridos.

### Restablecimiento del formulario de producto

- **Decisión**: Mantener el restablecimiento local en ambos modos del formulario. En alta,
  "Limpiar" vuelve a texto vacío y valores numéricos en cero; en edición, vuelve a los valores
  guardados del producto. "Cancelar" solo está disponible durante la edición, descarta los
  cambios locales y devuelve el formulario a modo alta vacío.
- **Justificación**: Permite distinguir entre corregir cambios sin salir de edición y abandonar
  una edición sin crear, actualizar ni eliminar productos.
- **Alternativas consideradas**: Hacer que "Cancelar" solo restaure los valores, vaciar los
  campos de edición, recargar la página o enviar una actualización para deshacer cambios. La
  primera duplica "Limpiar"; las demás no recuperan el flujo de alta o modifican innecesariamente
  el contexto o catálogo.
