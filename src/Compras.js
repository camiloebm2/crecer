import React, { useState, useEffect } from "react";
import FechaSelector from "./components/FechaSelector";
import BuscarProveedor from "./components/BuscarProveedor";
import BuscarPresentacion from "./components/BuscarPresentacion";
import Producto from "./components/Producto";
import DynamicQuantityInput from "./components/DynamicQuantityInput";
import InputNumerico from "./components/InputNumerico";
import ProductosRegistrados from "./components/ProductosRegistrados";
import SubirFactura from "./components/SubirFactura";
import { updateDoc, doc } from "firebase/firestore";
import db from "./firebase";
import "./compras.css";

const Compras = () => {
  const initialState = {
    fecha: new Date().toISOString().split("T")[0],
    proveedor: "",
    proveedorId: "",
    numFactura: "",
    tipoPago: "debito",
    producto: "",
    presentacion: "Unidad",
    cantidadTotal: 0,
    zarzamora: 0,
    tabora: 0,
    precioCompra: 0,
    id_prod: "",
  };

  const [compra, setCompra] = useState(initialState);
  const [productosLista, setProductosLista] = useState([]);
  const [totalFactura, setTotalFactura] = useState(0);
  const [indiceEdicion, setIndiceEdicion] = useState(null);

  useEffect(() => {
    setTotalFactura(
      productosLista.reduce(
        (sum, producto) => sum + producto.cantidadTotal * producto.precioCompra,
        0
      )
    );
  }, [productosLista]);

  const agregarOActualizarProducto = () => {
    if (!compra.producto || !compra.presentacion || compra.cantidadTotal <= 0) {
      alert("Debe completar los datos del producto antes de agregarlo.");
      return;
    }

    const nuevoProducto = {
      ...compra,
      cantidadTotal: Number(compra.cantidadTotal),
      zarzamora: Number(compra.zarzamora),
      tabora: Number(compra.tabora),
      precioCompra: Number(compra.precioCompra),
      id_prod: compra.id_prod || "",
    };

    if (!nuevoProducto.id_prod) {
      alert("El producto seleccionado no tiene un ID válido.");
      return;
    }

    setProductosLista((prevLista) =>
      indiceEdicion !== null
        ? prevLista.map((p, idx) => (idx === indiceEdicion ? nuevoProducto : p))
        : [...prevLista, nuevoProducto]
    );

    setIndiceEdicion(null);
    setCompra(initialState);
  };

  const subirFactura = async () => {
    try {
      const actualizaciones = productosLista.map(async (producto) => {
        if (!producto.id_prod) {
          console.error("Producto sin ID válido:", producto);
          return;
        }

        const productoRef = doc(db, "productos", producto.id_prod);
        
        console.log(`Actualizando producto ${producto.id_prod} con presentación: ${producto.presentacion}`);

        await updateDoc(productoRef, {
          presentacion: producto.presentacion,
          fecha_compra: compra.fecha,
        });
      });

      await Promise.all(actualizaciones);
      alert("Factura subida y presentación actualizada en Firebase.");
      setProductosLista([]);
      setCompra(initialState);
    } catch (error) {
      console.error("Error al subir la factura:", error);
    }
  };

  return (
    <div className="compras-container">
      <h1>Registro de Compras</h1>
      <FechaSelector onFechaChange={(fecha) => setCompra((prev) => ({ ...prev, fecha }))} disabled={productosLista.length > 0} />
      <BuscarProveedor onProveedorSelect={(proveedor) => setCompra((prev) => ({ ...prev, proveedor: proveedor.nombre, proveedorId: proveedor.id }))} disabled={productosLista.length > 0} />
      <InputNumerico label="Número de Factura" value={compra.numFactura} onChange={(value) => setCompra((prev) => ({ ...prev, numFactura: value }))} placeholder="Ingrese número de factura" disabled={productosLista.length > 0} />
      
      <div className="tipo-pago-container">
        <label>Tipo de Pago:</label>
        <select value={compra.tipoPago} onChange={(e) => setCompra((prev) => ({ ...prev, tipoPago: e.target.value }))}>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
        </select>
      </div>
      
      <BuscarPresentacion onPresentacionSelect={(presentacion) => setCompra((prev) => ({ ...prev, presentacion }))} />
      <Producto onProductoSelect={(producto) => setCompra((prev) => ({ ...prev, producto: producto.nombre_prod, id_prod: producto.id_prod }))} />
      <InputNumerico label="Cantidad Total" value={compra.cantidadTotal} onChange={(value) => setCompra((prev) => ({ ...prev, cantidadTotal: Number(value) }))} />
      <DynamicQuantityInput totalQuantity={compra.cantidadTotal} zarzamora={compra.zarzamora} tabora={compra.tabora} onChange={({ zarzamora, tabora }) => setCompra((prev) => ({ ...prev, zarzamora, tabora }))} />
      <InputNumerico label="Precio de Compra" value={compra.precioCompra} onChange={(value) => setCompra((prev) => ({ ...prev, precioCompra: Number(value) }))} />
      <button className="btn-agregar" onClick={agregarOActualizarProducto}>
        {indiceEdicion !== null ? "Actualizar Producto" : "Agregar Producto"}
      </button>
      <ProductosRegistrados productosLista={productosLista} setProductosLista={setProductosLista} setCompra={setCompra} setIndiceEdicion={setIndiceEdicion} />
      <h3>Total Factura: ${totalFactura.toFixed(2)}</h3>
      <div className="subir-factura-container">
        <SubirFactura productosLista={productosLista} setProductosLista={setProductosLista} setCompra={setCompra} onSubmit={subirFactura} />
      </div>
    </div>
  );
};

export default Compras;
