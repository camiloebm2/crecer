import React, { useState } from "react";
import BuscarPresentacion from "./BuscarPresentacion";
import FilaProducto from "./FilaProducto";
import "./TablaProductos.css";

const TablaProductos = ({ productos, cambios, manejarCambio, fechaHoy }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarActivarPresentaciones, setMostrarActivarPresentaciones] = useState(false);

  const togglePreciosAdicionales = (producto) => {
    setProductoSeleccionado((prev) => (prev?.id === producto.id ? null : producto));
  };

  return (
    <div className="tabla-container">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Último Precio</th>
            <th>Total Compra</th>
            <th>Nuevo Precio</th>
            <th>Precio Unitario</th>
            <th>Utilidad (%)</th>
            <th>Tara</th>
            <th>Presentación</th>
            <th>Zarzamora Unidades</th>
            <th>Tabora Unidades</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <FilaProducto
              key={producto.id}
              producto={producto}
              cambios={cambios}
              manejarCambio={manejarCambio}
              fechaHoy={fechaHoy}
              togglePreciosAdicionales={togglePreciosAdicionales}
              productoSeleccionado={productoSeleccionado}
              setMostrarActivarPresentaciones={setMostrarActivarPresentaciones}
            />
          ))}
        </tbody>
      </table>

      {mostrarActivarPresentaciones && productoSeleccionado && (
        <BuscarPresentacion
          producto={productoSeleccionado}
          cerrarModal={() => setMostrarActivarPresentaciones(false)}
        />
      )}
    </div>
  );
};

export default TablaProductos;
