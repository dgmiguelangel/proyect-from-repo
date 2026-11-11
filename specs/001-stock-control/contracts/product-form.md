# Contrato de interfaz: formulario de producto

## Acción “Limpiar”

| Modo | Precondición | Resultado | Efectos externos |
|---|---|---|---|
| Alta | El formulario está visible. | Código, nombre y descripción quedan vacíos; precio y stock mínimo quedan en `0`. | No crea, actualiza ni elimina productos. |

La acción no envía solicitudes a la API ni cambia el catálogo mostrado.
El botón se muestra únicamente durante el alta y permanece oculto durante la edición.

## Acción “Cancelar”

| Precondición | Resultado | Efectos externos |
|---|---|---|
| Hay un producto seleccionado para edición. | Se descartan los cambios locales, se abandona la edición y se muestra el formulario de alta vacío. | No crea, actualiza ni elimina productos. |

La acción no envía solicitudes a la API ni cambia el catálogo mostrado.
