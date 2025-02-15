import React from "react";
import InputNumerico from "./InputNumerico";
import UtilidadInput from "./UtilidadInput";
import TaraInput from "./TaraInput";
import TablaPreciosPorPresentacion from "./TablaPreciosPorPresentacion";

const FilaProducto = ({ producto, cambios, manejarCambio, fechaHoy, togglePreciosAdicionales, productoSeleccionado, setMostrarActivarPresentaciones }) => {
  const precioUnitario = producto.precio_compra || 1;
  const tieneCompraHoy = producto.fecha_compra === fechaHoy;
  const utilidadSugerida = tieneCompraHoy ? producto.utilidad_sug ?? 0 : "";
  const nuevoPrecioSugerido =
    tieneCompraHoy && utilidadSugerida
      ? (precioUnitario * (1 + utilidadSugerida / 100)).toFixed(2)
      : producto.precioc_ult ?? 0;
  const tara = cambios[producto.id]?.tara ?? producto.tara ?? 1;
  const unidadesZarza = (producto.cant_zarza || 0) * tara;
  const unidadesTabora = (producto.cant_tab || 0) * tara;

  return (
    <>
      <tr>
        <td className="producto-clickable" onClick={() => togglePreciosAdicionales(producto)}>
          {producto.nombre_prod || "Sin nombre"}
        </td>
        <td>{producto.precioc_ult || 0}</td>
        <td>{producto.total_compra || 0}</td>
        <td>
          <InputNumerico
            value={cambios[producto.id]?.nuevoPrecio ?? nuevoPrecioSugerido}
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
          <UtilidadInput
            producto={producto}
            cambios={cambios}
            manejarCambio={manejarCambio}
            precioUnitario={precioUnitario}
          />
        </td>
        <td>
          <TaraInput producto={producto} cambios={cambios} manejarCambio={manejarCambio} />
        </td>
        <td>{producto.presentacion || "No disponible"}</td>
        <td>{unidadesZarza}</td>
        <td>{unidadesTabora}</td>
      </tr>
      {productoSeleccionado?.id === producto.id && (
        <tr>
          <td colSpan="10">
            <TablaPreciosPorPresentacion
              producto={producto}
              mostrarActivarPresentaciones={() => setMostrarActivarPresentaciones(true)}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default FilaProducto;
