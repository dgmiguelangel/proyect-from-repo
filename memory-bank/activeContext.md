# Contexto activo

La feature `001-stock-control` implementa un monorepo npm con API Express/SQLite y UI React.
Las validaciones y movimientos se han verificado con las pruebas automatizadas definidas en la
feature. Tailwind CSS 3 está configurado en el frontend con PostCSS y estilos compartidos para
la navegación, formularios, tablas, alertas y estados vacíos. El catálogo permite buscar por
código y muestra su descripción; las pruebas frontend cubren los flujos principales.
El formulario de creación incluye “Limpiar”, que restablece sus valores sin solicitar cambios
al catálogo.
