import React from "react";
import "./productosRegistrados.css";

const ProductosRegistrados = ({ productosLista, setProductosLista, setCompra, setIndiceEdicion }) => {
  const seleccionarProducto = (index) => {
    const producto = productosLista[index];
    setCompra({
      producto: producto.producto,
      presentacion: producto.presentacion,
      cantidadTotal: producto.cantidadTotal,
      zarzamora: producto.zarzamora,
      tabora: producto.tabora,
      precioCompra: producto.precioCompra,
    });
    setIndiceEdicion(index);
  };

  const eliminarProducto = (index) => {
    const nuevaLista = productosLista.filter((_, i) => i !== index);
    setProductosLista(nuevaLista);
  };

  return (
    <div className="productos-registrados">
      <h2>Productos Registrados</h2>
      {productosLista.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Presentación</th>
              <th>Cantidad</th>
              <th>Zarzamora</th>
              <th>Tabora</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosLista.map((producto, index) => (
              <tr key={index}>
                <td>{typeof producto.producto === "string" ? producto.producto : producto.producto.nombre_prod}</td>
                <td>{producto.presentacion}</td>
                <td>{producto.cantidadTotal}</td>
                <td>{producto.zarzamora}</td>
                <td>{producto.tabora}</td>
                <td>${(producto.cantidadTotal * producto.precioCompra).toFixed(2)}</td>
                <td>
                  <button onClick={() => seleccionarProducto(index)}>Editar</button>
                  <button onClick={() => eliminarProducto(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay productos registrados.</p>
      )}
    </div>
  );
};

export default ProductosRegistrados;
