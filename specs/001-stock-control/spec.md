# Feature Specification: Control de stock

**Feature Branch**: `001-stock-control`

**Created**: 2026-11-06

**Status**: Implementada (documenta el comportamiento actual del sistema construido en `github.com/dgmiguelangel/stock`)

**Input**: User description: "Analizar la base de código construida y redactar el spec.md con el comportamiento actual: aplicación de control de stock para un único administrador que permite registrar, consultar, modificar y eliminar productos (código único, nombre, descripción, precio, cantidad disponible y stock mínimo), registrar entradas y salidas de mercadería con actualización automática de existencias, impedir stock negativo y mostrar los productos con stock bajo."

## Clarifications

### Session 2026-11-11

- Q: ¿Qué debe hacer el botón de limpiar del formulario de creación? → A: Restablecer los campos iniciales sin modificar el catálogo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestionar catálogo de productos (Priority: P1)

El administrador crea, consulta, actualiza y elimina productos para mantener un catálogo fiable
de los artículos que controla.

**Why this priority**: Sin productos identificados de forma única no es posible registrar ni
consultar existencias; es la base del resto de funcionalidades.

**Independent Test**: Se puede crear un producto, localizarlo en el catálogo, modificar sus
datos y eliminarlo si no tiene movimientos, obteniendo un catálogo actualizado.

**Acceptance Scenarios**:

1. **Given** que el catálogo no contiene el código ingresado, **When** el administrador registra
   un producto con código, nombre, descripción, precio y stock mínimo válidos, **Then** el
   producto queda disponible con cantidad disponible igual a cero.
2. **Given** que existe al menos un producto, **When** el administrador consulta el catálogo,
   **Then** visualiza la lista ordenada por código con precio, cantidad disponible y stock
   mínimo de cada producto.
3. **Given** que existe un producto, **When** el administrador lo busca por su código, **Then**
   visualiza todos sus datos y su cantidad disponible actual.
4. **Given** que existe un producto, **When** el administrador modifica nombre, descripción,
   precio o stock mínimo con valores válidos, **Then** la consulta posterior muestra los nuevos
   valores. El código no se puede editar desde el formulario de modificación.
5. **Given** que un producto no tiene movimientos registrados, **When** el administrador
   confirma su eliminación en el diálogo de confirmación, **Then** el producto deja de aparecer
   en el catálogo.
6. **Given** que un producto ya tiene movimientos registrados, **When** el administrador intenta
   eliminarlo, **Then** el sistema rechaza la operación e informa que no se puede eliminar un
   producto con movimientos.
7. **Given** que el administrador está creando un producto, **When** selecciona el botón para
   limpiar el formulario, **Then** código, nombre y descripción quedan vacíos, precio y stock
   mínimo vuelven a cero, y el catálogo no se modifica.

---

### User Story 2 - Registrar movimientos de mercadería (Priority: P1)

El administrador busca un producto por su código y registra entradas y salidas para que la
cantidad disponible refleje las existencias reales, consultando además el historial de
movimientos del producto.

**Why this priority**: El control fiable de existencias depende de registrar cada variación y
de evitar que el inventario quede por debajo de cero.

**Independent Test**: Se puede buscar un producto, registrar una entrada y una salida válidas y
comprobar que la cantidad disponible y el historial de movimientos se actualizan de forma
coherente.

**Acceptance Scenarios**:

1. **Given** que existe un producto con cantidad disponible de cero, **When** el administrador
   registra una entrada con cantidad entera positiva, **Then** la cantidad disponible aumenta
   por esa cantidad y el movimiento queda registrado con su fecha.
2. **Given** que existe un producto con cantidad disponible suficiente, **When** el
   administrador registra una salida con cantidad entera positiva no mayor que la disponible,
   **Then** la cantidad disponible disminuye por esa cantidad y el movimiento queda registrado
   con su fecha.
3. **Given** que existe un producto con menos unidades disponibles que las solicitadas, **When**
   el administrador intenta registrar una salida, **Then** el sistema rechaza la operación con
   el motivo "stock disponible insuficiente", mantiene la cantidad disponible y no registra el
   movimiento.
4. **Given** que existe un producto con movimientos, **When** el administrador consulta su
   historial, **Then** visualiza cada movimiento con fecha, tipo (Entrada/Salida) y cantidad,
   en orden cronológico de registro.
5. **Given** que el código buscado no existe, **When** el administrador intenta consultar o
   registrar un movimiento, **Then** el sistema informa que el producto no fue encontrado.

---

### User Story 3 - Identificar stock bajo (Priority: P2)

El administrador consulta los productos cuya cantidad disponible requiere atención para reponer
mercadería a tiempo.

**Why this priority**: La alerta permite tomar decisiones de reposición antes de que un
producto se agote, pero depende de que ya existan productos y movimientos.

**Independent Test**: Se puede consultar el listado de stock bajo con productos en distintos
niveles de existencias y verificar que contiene exactamente los que alcanzaron o bajaron de su
mínimo.

**Acceptance Scenarios**:

1. **Given** que un producto tiene una cantidad disponible menor o igual que su stock mínimo,
   **When** el administrador consulta los productos con stock bajo, **Then** el producto
   aparece en el listado con su código, nombre, cantidad disponible y stock mínimo.
2. **Given** que un producto tiene una cantidad disponible superior a su stock mínimo, **When**
   el administrador consulta los productos con stock bajo, **Then** el producto no aparece en
   el listado.
3. **Given** que ningún producto está en su mínimo o por debajo, **When** el administrador
   consulta el listado, **Then** el sistema muestra el mensaje "No hay productos con stock
   bajo."

### Edge Cases

- Se rechaza el alta o la modificación cuando el código ya pertenece a otro producto.
- Se rechazan precios negativos, stocks mínimos negativos, cantidades de movimiento negativas,
  cero o no enteras, y textos obligatorios vacíos o compuestos solo de espacios.
- Una modificación sin ningún campo para actualizar se rechaza como entrada inválida.
- Una salida exactamente igual a la cantidad disponible se acepta y deja el producto con
  cantidad cero.
- Si un producto no existe, no se permite consultar sus detalles, modificarlo, eliminarlo,
  listar sus movimientos ni registrarle un movimiento.
- Una operación de movimiento que no pueda completar íntegramente la actualización de la
  cantidad y el registro del movimiento no modifica ninguna de las dos informaciones
  (todo-o-nada).
- La cantidad disponible no se puede editar directamente: solo cambia como resultado de
  registrar movimientos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir al administrador crear productos con código único,
  nombre, descripción, precio y stock mínimo.
- **FR-002**: El sistema DEBE iniciar la cantidad disponible de todo producto nuevo en cero y
  mostrar la cantidad actual al consultar el producto.
- **FR-003**: El sistema DEBE permitir al administrador consultar el catálogo completo ordenado
  por código y localizar un producto por su código.
- **FR-004**: El sistema DEBE permitir al administrador modificar los datos de un producto
  existente, sin permitir códigos duplicados, precios negativos ni stocks mínimos negativos.
- **FR-005**: El sistema DEBE solicitar confirmación antes de eliminar un producto y solo
  permitir la eliminación si este no tiene movimientos registrados.
- **FR-006**: El sistema DEBE permitir registrar entradas de mercadería con una cantidad entera
  positiva para un producto existente e incrementar su cantidad disponible por esa cantidad.
- **FR-007**: El sistema DEBE permitir registrar salidas de mercadería con una cantidad entera
  positiva únicamente cuando no exceda la cantidad disponible, y disminuir dicha cantidad por
  esa cantidad.
- **FR-008**: El sistema DEBE impedir cualquier operación que deje una cantidad disponible
  negativa y comunicar claramente el motivo del rechazo al administrador.
- **FR-009**: El sistema DEBE registrar para cada entrada o salida el producto, tipo de
  movimiento, cantidad y fecha, conservando ese registro de forma permanente junto con la
  actualización de existencias, y DEBE permitir consultar el historial de movimientos de cada
  producto.
- **FR-010**: El sistema DEBE identificar y mostrar los productos cuya cantidad disponible sea
  menor o igual que su stock mínimo.
- **FR-011**: El sistema DEBE validar los datos obligatorios y mostrar mensajes comprensibles,
  sin exponer detalles internos, cuando una operación no pueda completarse.
- **FR-012**: El sistema DEBE limitar las acciones de esta versión al control de productos y
  existencias para un único administrador; no incluye facturación, compras, ventas,
  proveedores, clientes, pagos ni múltiples depósitos.
- **FR-013**: El sistema DEBE ofrecer, durante la creación de un producto, un botón para
  restablecer el formulario a sus valores iniciales sin crear, modificar ni eliminar productos.

### Key Entities *(include if feature involves data)*

- **Producto**: Artículo administrado en el catálogo; contiene código único, nombre,
  descripción, precio, cantidad disponible y stock mínimo.
- **Movimiento de mercadería**: Registro inmutable de una entrada o salida asociada a un
  producto; contiene tipo, cantidad y fecha, y explica cada cambio de existencias.
- **Administrador**: Único usuario responsable de gestionar productos, movimientos y alertas de
  stock bajo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El administrador puede registrar un producto válido y encontrarlo nuevamente en
  el catálogo en menos de 1 minuto.
- **SC-002**: El 100% de las salidas que superarían la cantidad disponible son rechazadas sin
  cambiar las existencias ni crear un movimiento.
- **SC-003**: En pruebas con al menos 100 entradas y salidas válidas, la cantidad mostrada de
  cada producto coincide con el saldo de sus movimientos registrados.
- **SC-004**: El listado de stock bajo incluye el 100% de los productos cuya cantidad
  disponible es menor o igual a su stock mínimo y excluye a los demás.
- **SC-005**: El administrador completa en su primer intento al menos el 95% de las operaciones
  habituales de alta, consulta, modificación, movimiento y consulta de stock bajo, con mensajes
  de error comprensibles cuando la operación no es válida.

## Assumptions

- Existe un único administrador autorizado para utilizar la aplicación; no se requiere gestión
  de usuarios, autenticación ni roles en esta versión.
- El código identifica de forma única a cada producto y se usa para localizarlo dentro del
  catálogo; una vez creado, el código no se modifica desde la interfaz.
- La cantidad disponible es el saldo derivado de los movimientos: los productos se crean con
  saldo cero y la cantidad no se modifica directamente.
- La fecha de cada movimiento se registra automáticamente al momento de confirmarlo.
- Los importes se expresan en la moneda habitual del comercio, sin conversiones ni reglas de
  redondeo especiales.
- La aplicación opera sobre una única instancia local de datos; no se contemplan múltiples
  depósitos ni acceso concurrente de varios usuarios.
- La primera versión se limita al alcance establecido y excluye facturación, compras, ventas,
  proveedores, clientes, pagos y múltiples depósitos.
