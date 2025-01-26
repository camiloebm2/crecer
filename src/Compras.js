import React, { useState } from "react";
import useFirebaseCollection from "./components/hooks";
import {
  validateCompra,
  formatNumber,
} from "./components/utils";
import InputNumerico from "./components/InputNumerico";
import Proveedor from "./components/Proveedor";
import Producto from "./components/Producto";
import FechaSelector from "./components/FechaSelector";
import TablaProductos from "./components/TablaProductos";
import "./compras.css";

const Compras = () => {
  const [compra, setCompra] = useState({
    fecha_compra: new Date().toISOString().split("T")[0],
    forma_pago: "",
    id_prov: "",
    num_factura: "",
  });

  const [productoActual, setProductoActual] = useState({
    id_prod: "",
    cantidad_total: "",
    zarzamora: "",
    tabora: "",
    precio_compra: "",
  });

  const [productosLista, setProductosLista] = useState([]);
  const proveedores = useFirebaseCollection("proveedores");

  // Manejo genérico de cambios en la compra
  const handleCompraChange = (field, value) => {
    setCompra((prevState) => ({ ...prevState, [field]: value }));
  };

  // Manejo genérico de cambios en el producto actual
  const handleProductoChange = (field, value) => {
    setProductoActual((prevState) => ({ ...prevState, [field]: value }));
  };

  // Agregar un producto a la lista
  const agregarProducto = () => {
    const { id_prod, cantidad_total, zarzamora, tabora, precio_compra } = productoActual;

    if (!id_prod || !cantidad_total || !zarzamora || !tabora || !precio_compra) {
      alert("Por favor complete todos los campos del producto.");
      return;
    }

    setProductosLista((prevState) => [...prevState, { ...productoActual }]);
    setProductoActual({
      id_prod: "",
      cantidad_total: "",
      zarzamora: "",
      tabora: "",
      precio_compra: "",
    });
  };

  // Registrar la compra
  const registrarCompra = () => {
    const error = validateCompra(compra, productosLista);
    if (error) {
      alert(error);
      return;
    }

    // Simulación de registro en Firebase
    console.log("Compra registrada:", { compra, productosLista });
    alert("Compra registrada exitosamente.");
    setCompra({
      fecha_compra: new Date().toISOString().split("T")[0],
      forma_pago: "",
      id_prov: "",
      num_factura: "",
    });
    setProductosLista([]);
  };

  return (
    <div className="compras-container">
      <h1>Registro de Compras</h1>

      {/* Formulario para la información de la compra */}
      <div className="formulario-compra">
        <FechaSelector
          label="Fecha de Compra"
          value={compra.fecha_compra}
          onChange={(value) => handleCompraChange("fecha_compra", value)}
        />

        <div>
          <label>Forma de Pago:</label>
          <select
            value={compra.forma_pago}
            onChange={(e) => handleCompraChange("forma_pago", e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="Contado">Contado</option>
            <option value="Crédito">Crédito</option>
          </select>
        </div>

        <Proveedor
          onProveedorSelect={(prov) => handleCompraChange("id_prov", prov.id)}
        />

        <InputNumerico
          label="Número de Factura"
          value={compra.num_factura}
          onChange={(value) => handleCompraChange("num_factura", value)}
        />
      </div>

      {/* Formulario para agregar productos */}
      <div className="formulario-productos">
        <Producto
          onProductoSelect={(prod) => handleProductoChange("id_prod", prod.id)}
        />

        <InputNumerico
          label="Cantidad Total"
          value={productoActual.cantidad_total}
          onChange={(value) => handleProductoChange("cantidad_total", value)}
        />

        <InputNumerico
          label="Cantidad Zarzamora"
          value={productoActual.zarzamora}
          onChange={(value) => handleProductoChange("zarzamora", value)}
        />

        <InputNumerico
          label="Cantidad Tabora"
          value={productoActual.tabora}
          onChange={(value) => handleProductoChange("tabora", value)}
        />

        <InputNumerico
          label="Precio de Compra"
          value={productoActual.precio_compra}
          onChange={(value) => handleProductoChange("precio_compra", value)}
        />

        <button onClick={agregarProducto} className="btn-agregar">
          Agregar Producto
        </button>
      </div>

      {/* Tabla con los productos agregados */}
      <TablaProductos
        columnas={["Producto", "Cantidad Total", "Zarzamora", "Tabora", "Precio Compra"]}
        datos={productosLista.map((prod) => ({
          ...prod,
          cantidad_total: formatNumber(prod.cantidad_total),
          zarzamora: formatNumber(prod.zarzamora),
          tabora: formatNumber(prod.tabora),
          precio_compra: formatNumber(prod.precio_compra),
        }))}
      />

      <button onClick={registrarCompra} className="btn-registrar">
        Registrar Compra
      </button>
    </div>
  );
};

export default Compras;
