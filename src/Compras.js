import React, { useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import db from "./firebase";
import EntradaDatos from "./components/EntradaDatos";
import TablaProductos from "./components/TablaProductos";
import Producto from "./components/Producto"; // Componente Producto
import Proveedor from "./components/Proveedor"; // Componente Proveedor
import "./compras.css";

const Compras = () => {
  const [productosLista, setProductosLista] = useState([]); // Lista de productos agregados a la compra
  const [compra, setCompra] = useState({
    fecha_compra: new Date().toISOString().split("T")[0],
    forma_pago: "",
    id_prov: "",
    nombre_prov: "",
    num_factura: "",
  });
  const [productoActual, setProductoActual] = useState({
    id_prod: "",
    cantidad_total: "",
    zarzamora: "",
    tabora: "",
    precio_compra: "",
  });

  // Manejar cambios en el formulario de compra
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if (name in productoActual) {
      setProductoActual((prev) => ({ ...prev, [name]: value }));
    } else {
      setCompra((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejar la selección de un proveedor desde el componente Proveedor
  const manejarSeleccionProveedor = (proveedor) => {
    setCompra((prev) => ({
      ...prev,
      id_prov: proveedor.id_prov,
      nombre_prov: proveedor.nombre_prov,
    }));
  };

  // Manejar la selección de un producto desde el componente Producto
  const manejarSeleccionProducto = (producto) => {
    setProductoActual((prev) => ({
      ...prev,
      id_prod: producto.id,
    }));
  };

  // Agregar un producto a la lista
  const agregarProducto = () => {
    if (
      !productoActual.id_prod ||
      !productoActual.cantidad_total ||
      !productoActual.zarzamora ||
      !productoActual.tabora ||
      !productoActual.precio_compra
    ) {
      alert("Por favor complete todos los campos del producto.");
      return;
    }

    setProductosLista((prev) => [...prev, { ...productoActual }]);

    setProductoActual({
      id_prod: "",
      cantidad_total: "",
      zarzamora: "",
      tabora: "",
      precio_compra: "",
    });
  };

  // Registrar la compra
  const registrarCompra = async () => {
    if (!compra.id_prov || !compra.num_factura || productosLista.length === 0) {
      alert("Complete los datos de la compra y agregue al menos un producto.");
      return;
    }
    try {
      // Registrar la compra en la colección "compras"
      await addDoc(collection(db, "compras"), {
        ...compra,
        productos: productosLista,
      });

      // Actualizar el inventario de productos
      for (const producto of productosLista) {
        const productoRef = doc(db, "productos", producto.id_prod);
        await updateDoc(productoRef, {
          cantidad_compra_tabora: parseInt(producto.tabora),
          cantidad_compra_zarzamora: parseInt(producto.zarzamora),
          ultima_compra: compra.fecha_compra,
        });
      }

      alert("Compra registrada exitosamente.");

      // Limpiar el formulario
      setCompra({
        fecha_compra: new Date().toISOString().split("T")[0],
        forma_pago: "",
        id_prov: "",
        nombre_prov: "",
        num_factura: "",
      });
      setProductosLista([]);
    } catch (error) {
      console.error("Error registrando compra:", error);
      alert("Hubo un error al registrar la compra.");
    }
  };

  return (
    <div className="compras-container">
      <h1>Registro de Compras</h1>

      {/* Selección de proveedor */}
      <div className="formulario-compra">
        <h2>Datos de la Compra</h2>
        <EntradaDatos
          label="Fecha de Compra"
          type="date"
          name="fecha_compra"
          value={compra.fecha_compra}
          onChange={manejarCambio}
        />
        <EntradaDatos
          label="Forma de Pago"
          type="text"
          name="forma_pago"
          value={compra.forma_pago}
          onChange={manejarCambio}
          options={[
            { id: "Contado", nombre: "Contado" },
            { id: "Crédito", nombre: "Crédito" },
          ]}
        />
        <EntradaDatos
          label="Número de Factura"
          type="text"
          name="num_factura"
          value={compra.num_factura}
          onChange={manejarCambio}
        />
        <h2>Seleccionar Proveedor</h2>
        <Proveedor onProveedorSelect={manejarSeleccionProveedor} />
      </div>

      {/* Selección de producto */}
      <div className="formulario-producto">
        <h2>Agregar Producto</h2>
        <Producto onProductoSelect={manejarSeleccionProducto} />
        <EntradaDatos
          label="Cantidad Total"
          type="number"
          name="cantidad_total"
          value={productoActual.cantidad_total}
          onChange={manejarCambio}
        />
        <EntradaDatos
          label="Cantidad Zarzamora"
          type="number"
          name="zarzamora"
          value={productoActual.zarzamora}
          onChange={manejarCambio}
        />
        <EntradaDatos
          label="Cantidad Tabora"
          type="number"
          name="tabora"
          value={productoActual.tabora}
          onChange={manejarCambio}
        />
        <EntradaDatos
          label="Precio de Compra"
          type="number"
          name="precio_compra"
          value={productoActual.precio_compra}
          onChange={manejarCambio}
        />
        <button className="btn-agregar" onClick={agregarProducto}>
          Agregar Producto
        </button>
      </div>

      {/* Lista de productos */}
      <TablaProductos
        columnas={["Producto", "Cantidad Total", "Zarzamora", "Tabora", "Precio Compra"]}
        datos={productosLista}
      />

      {/* Botón para registrar la compra */}
      <button className="btn-registrar" onClick={registrarCompra}>
        Registrar Compra
      </button>
    </div>
  );
};

export default Compras;
