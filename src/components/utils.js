// Aquí defines tus utilidades o funciones

export const validateCompra = (compra, productosLista) => {
  if (!compra.proveedor) {
    return "El proveedor es obligatorio.";
  }
  if (!compra.numFactura) {
    return "El número de factura es obligatorio.";
  }
  if (!compra.formaPago) {
    return "La forma de pago es obligatoria.";
  }
  if (productosLista.length === 0) {
    return "Debe agregar al menos un producto a la lista.";
  }
  return null; // No hay errores
};

// Otras utilidades que quieras agregar
export const calculateTotal = (productos) => {
  return productos.reduce((total, producto) => total + producto.precioCompra * producto.cantidadTotal, 0);
};

// Exportar un objeto (opcional)
const utils = {
  validateCompra,
  calculateTotal,
};

export default utils;
