# Modelo de datos

## Producto

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | entero | Identificador interno. |
| `code` | texto | Obligatorio, sin espacios solamente y único; inmutable después del alta. |
| `name` | texto | Obligatorio, no vacío. |
| `description` | texto | Obligatorio, no vacío. |
| `price` | decimal | Obligatorio, mayor o igual que cero. |
| `quantityAvailable` | entero | Inicia en `0`, nunca es negativo y solo cambia mediante movimientos. |
| `minimumStock` | entero | Obligatorio, mayor o igual que cero. |

Un producto tiene cero o muchos movimientos. No puede eliminarse mientras tenga al menos un
movimiento.

## Movimiento de mercadería

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | entero | Identificador interno. |
| `productId` | entero | Referencia obligatoria a `Producto`; eliminación restringida. |
| `type` | enumeración | `ENTRY` o `EXIT`. |
| `quantity` | entero | Obligatorio y estrictamente positivo. |
| `createdAt` | fecha/hora | Asignada automáticamente al confirmar el movimiento. |

Los movimientos son append-only. Una entrada incrementa `quantityAvailable`; una salida solo se
acepta si `quantity <= quantityAvailable` y la reduce. La actualización del producto y la
inserción del movimiento ocurren en una transacción.

## Vistas derivadas

- **Catálogo**: productos ordenados ascendentemente por `code`.
- **Historial**: movimientos de un producto ordenados cronológicamente por registro.
- **Stock bajo**: productos donde `quantityAvailable <= minimumStock`.

## Administrador

No se persiste como entidad en esta versión: hay un único administrador implícitamente autorizado
para todas las acciones.
