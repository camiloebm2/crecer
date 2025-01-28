import React, { useState, useEffect } from "react";
import FechaSelector from "./components/FechaSelector";
import BuscarProveedor from "./components/BuscarProveedor";
import BuscarPresentacion from "./components/BuscarPresentacion";
import Producto from "./components/Producto";
import DynamicQuantityInput from "./components/DynamicQuantityInput";
import InputNumerico from "./components/InputNumerico";
import "./compras.css";

const Compras = () => {
  const [compra, setCompra] = useState({
    fecha: new Date().toISOString().split("T")[0],
    proveedor: "",
    proveedorId: "",
    producto: "",
    presentacion: "",
    cantidadTotal: 0,
    zarzamora: 0,
    tabora: 0,
    precioCompra: 0,
    numFactura: "",
    formaPago: "",
  });

  const [productosLista, setProductosLista] = useState([]);
  const [totalFactura, setTotalFactura] = useState(0);
  const [indiceEdicion, setIndiceEdicion] = useState(null);

  useEffect(() => {
    console.log("Compra actualizada:", compra);
  }, [compra]);

  useEffect(() => {
    console.log("Lista de productos actualizada:", productosLista);
    const total = productosLista.reduce(
      (sum, producto) => sum + producto.cantidadTotal * producto.precioCompra,
      0
    );
    setTotalFactura(total);
  }, [productosLista]);

  // Manejo de selección de proveedor
  const handleProveedorSelect = (proveedor) => {
    console.log("Proveedor seleccionado:", proveedor);
    setCompra((prev) => ({
      ...prev,
      proveedor: proveedor.nombre,
      proveedorId: proveedor.id,
    }));
  };

  // Manejo de selección de producto (GUARDANDO SOLO EL NOMBRE)
  const handleProductoSelect = (producto) => {
    setCompra((prev) => ({
      ...prev,
      producto: producto.nombre_prod, // ✅ Solo guardamos el nombre del producto
    }));
  };

  // Agregar o actualizar producto en la lista
  const agregarOActualizarProducto = () => {
    console.log("Estado actual de compra antes de validar:", compra);

    if (!compra.producto || !compra.presentacion || compra.cantidadTotal <= 0) {
      alert("Debe completar los datos del producto antes de agregarlo.");
      return;
    }

    const nuevoProducto = {
      producto: compra.producto,
      presentacion: compra.presentacion,
      cantidadTotal: Number(compra.cantidadTotal),
      zarzamora: Number(compra.zarzamora),
      tabora: Number(compra.tabora),
      precioCompra: Number(compra.precioCompra),
    };

    console.log("Procesando producto:", nuevoProducto);

    setProductosLista((prevLista) => {
      if (indiceEdicion !== null) {
        // ✅ Si se está editando, actualiza el producto en la lista
        const nuevaLista = [...prevLista];
        nuevaLista[indiceEdicion] = nuevoProducto;
        return nuevaLista;
      } else {
        // ✅ Si es un nuevo producto, agrégalo a la lista
        return [...prevLista, nuevoProducto];
      }
    });

    limpiarFormulario();
  };

  // Función para seleccionar producto y editarlo
  const seleccionarProducto = (index) => {
    const producto = productosLista[index];
    setCompra({
      ...compra,
      producto: producto.producto,
      presentacion: producto.presentacion,
      cantidadTotal: producto.cantidadTotal,
      zarzamora: producto.zarzamora,
      tabora: producto.tabora,
      precioCompra: producto.precioCompra,
    });
    setIndiceEdicion(index);
  };

  // Función para eliminar producto de la lista
  const eliminarProducto = (index) => {
    const nuevaLista = productosLista.filter((_, i) => i !== index);
    setProductosLista(nuevaLista);
  };

  // Limpiar formulario después de agregar o actualizar producto
  const limpiarFormulario = () => {
    setCompra((prev) => ({
      ...prev,
      producto: "",
      presentacion: "",
      cantidadTotal: 0,
      zarzamora: 0,
      tabora: 0,
      precioCompra: 0,
    }));
    setIndiceEdicion(null);
  };

  return (
    <div className="compras-container">
      <h1>Registro de Compras</h1>

      <FechaSelector
        onFechaChange={(fecha) => setCompra((prev) => ({ ...prev, fecha }))}
      />

      <div className="form-row">
        <BuscarProveedor onProveedorSelect={handleProveedorSelect} />
      </div>

      {compra.proveedor && (
        <p>
          <strong>Proveedor Seleccionado:</strong> {compra.proveedor} (ID: {compra.proveedorId})
        </p>
      )}

      <div className="form-row">
        <BuscarPresentacion
          onPresentacionSelect={(presentacion) =>
            setCompra((prev) => ({ ...prev, presentacion }))
          }
        />
      </div>

      <Producto onProductoSelect={handleProductoSelect} />

      <InputNumerico
        label="Cantidad Total"
        value={compra.cantidadTotal}
        onChange={(value) =>
          setCompra((prev) => ({ ...prev, cantidadTotal: Number(value) }))
        }
        placeholder="Ingrese cantidad"
      />

      <DynamicQuantityInput
        totalQuantity={Number(compra.cantidadTotal)}
        zarzamora={Number(compra.zarzamora)}
        tabora={Number(compra.tabora)}
        onChange={({ zarzamora, tabora }) =>
          setCompra((prev) => ({ ...prev, zarzamora, tabora }))
        }
      />

      <InputNumerico
        label="Precio de Compra"
        value={compra.precioCompra}
        onChange={(value) =>
          setCompra((prev) => ({ ...prev, precioCompra: Number(value) }))
        }
        placeholder="Ingrese precio"
      />

      <button className="btn-agregar" onClick={agregarOActualizarProducto}>
        {indiceEdicion !== null ? "Actualizar Producto" : "Agregar Producto"}
      </button>

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
                  <td>{producto.producto}</td>
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

      <h3>Total Factura: ${totalFactura.toFixed(2)}</h3>
    </div>
  );
};

export default Compras;
