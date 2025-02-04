import React from "react";
import FechaSelector from "./FechaSelector";
import BuscarProveedor from "./BuscarProveedor";
import BuscarPresentacion from "./BuscarPresentacion";
import Producto from "./Producto";
import DynamicQuantityInput from "./DynamicQuantityInput";
import InputNumerico from "./InputNumerico";

const FormularioCompra = ({ compra, setCompra, agregarOActualizarProducto, productosLista }) => {
  const isEditable = productosLista.length === 0; // Si hay productos, bloquea edición
  const isAgregarProductoHabilitado =
    compra.proveedorId &&
    compra.numFactura &&
    compra.producto &&
    compra.presentacion &&
    compra.cantidadTotal > 0;

  return (
    <div className="formulario-compra">
      <FechaSelector
        onFechaChange={(fecha) => setCompra((prev) => ({ ...prev, fecha }))}
        disabled={!isEditable}
      />

      <BuscarProveedor
        onProveedorSelect={(proveedor) =>
          setCompra((prev) => ({ ...prev, proveedor: proveedor.nombre, proveedorId: proveedor.id }))
        }
        disabled={!isEditable}
      />

      <label>
        Número de Factura:
        <input
          type="text"
          value={compra.numFactura}
          onChange={(e) => setCompra((prev) => ({ ...prev, numFactura: e.target.value }))}
          disabled={!isEditable}
        />
      </label>

      <BuscarPresentacion
        onPresentacionSelect={(presentacion) =>
          setCompra((prev) => ({ ...prev, presentacion: presentacion })) // ✅ Se vacía después de agregar
        }
      />

      <Producto
        onProductoSelect={(producto) =>
          setCompra((prev) => ({ ...prev, producto: producto })) // ✅ Se vacía después de agregar
        }
      />

      <InputNumerico
        label="Cantidad Total"
        value={compra.cantidadTotal}
        onChange={(value) => setCompra((prev) => ({ ...prev, cantidadTotal: Number(value) }))}
      />

      <DynamicQuantityInput
        totalQuantity={Number(compra.cantidadTotal)}
        zarzamora={Number(compra.zarzamora)}
        tabora={Number(compra.tabora)}
        onChange={({ zarzamora, tabora }) => setCompra((prev) => ({ ...prev, zarzamora, tabora }))}
      />

      <InputNumerico
        label="Precio de Compra"
        value={compra.precioCompra}
        onChange={(value) => setCompra((prev) => ({ ...prev, precioCompra: Number(value) }))}
      />

      <button
        className="btn-agregar"
        onClick={agregarOActualizarProducto}
        disabled={!isAgregarProductoHabilitado}
      >
        {productosLista.length > 0 ? "Actualizar Producto" : "Agregar Producto"}
      </button>
    </div>
  );
};

export default FormularioCompra;
