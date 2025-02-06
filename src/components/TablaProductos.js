import React from "react";
import InputNumerico from "./InputNumerico";

const TablaProductos = ({ productos, cambios, manejarCambio, fechaHoy }) => {
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
          {productos.map((producto) => {
            const tara = cambios[producto.id]?.tara || producto.tara || 1;
            const precioNuevo = cambios[producto.id]?.precioNuevo ?? "";
            const precioUnitario =
              producto.precio_compra > 0
                ? (producto.precio_compra / (producto.cant_zarza + producto.cant_tab || 1)).toFixed(2)
                : 0;
            const utilidad =
              precioNuevo && precioUnitario > 0
                ? ((precioNuevo - precioUnitario) / precioUnitario) * 100
                : 0;

            return (
              <tr key={producto.id}>
                <td>{producto.nombre_prod || "Sin nombre"}</td>
                <td>{producto.precioc_ult || 0}</td>
                <td>{producto.precio_compra || 0}</td>
                <td>
                  <InputNumerico
                    value={precioNuevo}
                    onChange={(value) => manejarCambio(producto.id, "precioNuevo", value)}
                  />
                </td>
                <td>{precioUnitario}</td>
                <td>
                  <InputNumerico
                    value={utilidad ? Math.round(utilidad) : 0}
                    onChange={(value) =>
                      manejarCambio(producto.id, "precioNuevo", ((precioUnitario * (100 + value)) / 100).toFixed(2))
                    }
                  />
                </td>
                <td>
                  <InputNumerico
                    value={tara}
                    onChange={(value) => manejarCambio(producto.id, "tara", value)}
                  />
                </td>
                <td>{producto.presentacion || "No disponible"}</td>
                <td>{producto.fecha_compra === fechaHoy ? producto.cant_zarza : 0}</td>
                <td>{producto.fecha_compra === fechaHoy ? producto.cant_tab : 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProductos;
