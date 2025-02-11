import React, { useState } from "react";
import TablaPreciosPorPresentacion from "./TablaPreciosPorPresentacion";
import BuscarPresentacion from "./BuscarPresentacion";
import InputNumerico from "./InputNumerico";

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
          {productos
            .filter((producto) =>
              productoSeleccionado ? producto.id === productoSeleccionado.id : true
            )
            .map((producto) => {
              const precioUnitario = producto.precio_compra || 1;
              const nuevoPrecio = cambios[producto.id]?.nuevoPrecio ?? producto.precioc_ult ?? 0;
              
              // ✅ Calcula la utilidad dinámicamente
              const utilidadCalculada =
                nuevoPrecio > 0 && precioUnitario > 0
                  ? (((nuevoPrecio - precioUnitario) / precioUnitario) * 100).toFixed(2)
                  : "";

              return (
                <React.Fragment key={producto.id}>
                  <tr>
                    <td
                      className="producto-clickable"
                      onClick={() => togglePreciosAdicionales(producto)}
                    >
                      {producto.nombre_prod || "Sin nombre"}
                    </td>
                    <td>{producto.precioc_ult || 0}</td>
                    <td>{producto.precio_compra || 0}</td>
                    <td>
                      <InputNumerico
                        value={nuevoPrecio}
                        onChange={(value) => {
                          manejarCambio(producto.id, "nuevoPrecio", value);
                          if (precioUnitario > 0) {
                            const nuevaUtilidad = ((value - precioUnitario) / precioUnitario) * 100;
                            manejarCambio(producto.id, "utilidad", nuevaUtilidad.toFixed(2));
                          }
                        }}
                      />
                    </td>
                    <td>{precioUnitario.toFixed(2)}</td>
                    <td>
                      <InputNumerico
                        value={cambios[producto.id]?.utilidad ?? utilidadCalculada}
                        onChange={(value) => {
                          manejarCambio(producto.id, "utilidad", value);
                          if (precioUnitario > 0) {
                            const nuevoPrecioCalculado = precioUnitario * (1 + value / 100);
                            manejarCambio(producto.id, "nuevoPrecio", nuevoPrecioCalculado.toFixed(2));
                          }
                        }}
                      />
                    </td>
                    <td>
                      <InputNumerico
                        value={cambios[producto.id]?.tara ?? producto.tara ?? 1}
                        onChange={(value) => manejarCambio(producto.id, "tara", value)}
                      />
                    </td>
                    <td>{producto.presentacion || "No disponible"}</td>
                    <td>{producto.cant_zarza || 0}</td>
                    <td>{producto.cant_tab || 0}</td>
                  </tr>

                  {productoSeleccionado?.id === producto.id && (
                    <tr>
                      <td colSpan="10">
                        <TablaPreciosPorPresentacion
                          producto={producto}
                          mostrarActivarPresentaciones={() =>
                            setMostrarActivarPresentaciones(true)
                          }
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
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
