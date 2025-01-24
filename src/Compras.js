import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import db from "./firebase"; // Archivo de configuración de Firebase
import "./compras.css"; // Archivo de estilos

const Compras = () => {
  const [proveedores, setProveedores] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosLista, setProductosLista] = useState([]);
  const [distribucion, setDistribucion] = useState({ zarzamora: 0, tabora: 0 });
  const [compra, setCompra] = useState({
    fecha_compra: new Date().toISOString().split("T")[0],
    forma_pago: "contado",
    id_prov: "",
    num_factura: "",
    id_prod: "",
    presentacion: "",
    cantidad: "",
  });

  const [indiceEdicion, setIndiceEdicion] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const proveedoresSnapshot = await getDocs(collection(db, "proveedores"));
        const presentacionesSnapshot = await getDocs(collection(db, "presentacion"));
        const productosSnapshot = await getDocs(collection(db, "productos"));

        setProveedores(
          proveedoresSnapshot.docs.map((doc) => ({
            id: doc.id,
            nombre_prov: doc.data().nombre_prov,
          }))
        );

        setPresentaciones(
          presentacionesSnapshot.docs.map((doc) => ({
            id: doc.id,
            nombre_presentacion: doc.data().nombre_presentacion,
          }))
        );

        setProductos(
          productosSnapshot.docs.map((doc) => ({
            id: doc.id,
            nombre_prod: doc.data().nombre_prod,
          }))
        );
      } catch (error) {
        console.error("Error cargando datos desde Firebase:", error);
      }
    };

    cargarDatos();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if (name === "id_prod") {
      setCompra((prevState) => ({
        ...prevState,
        id_prod: value,
        cantidad: "",
      }));
      setDistribucion({ zarzamora: 0, tabora: 0 });
    } else {
      setCompra((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const manejarCambioDistribucion = (e) => {
    const { name, value } = e.target;
    const cantidadIngresada = parseInt(value, 10) || 0;
    const cantidadTotal = parseInt(compra.cantidad, 10) || 0;

    if (cantidadIngresada > cantidadTotal) {
      alert("La cantidad ingresada no puede ser mayor a la cantidad total.");
      return;
    }

    if (name === "zarzamora") {
      setDistribucion({
        zarzamora: cantidadIngresada,
        tabora: cantidadTotal - cantidadIngresada,
      });
    } else if (name === "tabora") {
      setDistribucion({
        zarzamora: cantidadTotal - cantidadIngresada,
        tabora: cantidadIngresada,
      });
    }
  };

  const validarCamposPrincipales = () => {
    const camposFaltantes = [];
    if (!compra.fecha_compra) camposFaltantes.push("Fecha de Compra");
    if (!compra.id_prov) camposFaltantes.push("Proveedor");
    if (!compra.forma_pago) camposFaltantes.push("Forma de Pago");
    if (!compra.num_factura) camposFaltantes.push("Número de Factura");

    if (camposFaltantes.length > 0) {
      alert(
        `Debe completar los siguientes campos: ${camposFaltantes.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const agregarOActualizarProducto = () => {
    if (!validarCamposPrincipales()) {
      return;
    }

    const cantidadTotalDistribuida =
      parseInt(distribucion.zarzamora, 10) + parseInt(distribucion.tabora, 10);

    if (cantidadTotalDistribuida !== parseInt(compra.cantidad, 10)) {
      alert("La distribución no coincide con la cantidad total.");
      return;
    }

    const nuevoProducto = {
      id_prod: compra.id_prod,
      nombre_prod: productos.find((p) => p.id === compra.id_prod)?.nombre_prod || "",
      presentacion: presentaciones.find((p) => p.id === compra.presentacion)
        ?.nombre_presentacion || "",
      cantidad: compra.cantidad,
      distribucion,
    };

    if (indiceEdicion !== null) {
      const nuevaLista = [...productosLista];
      nuevaLista[indiceEdicion] = nuevoProducto;
      setProductosLista(nuevaLista);
      setIndiceEdicion(null);
    } else {
      setProductosLista((prevLista) => [...prevLista, nuevoProducto]);
    }

    limpiarFormulario();
  };

  const seleccionarProducto = (index) => {
    const producto = productosLista[index];
    setCompra({
      ...compra,
      id_prod: producto.id_prod,
      presentacion: presentaciones.find(
        (p) => p.nombre_presentacion === producto.presentacion
      )?.id || "",
      cantidad: producto.cantidad,
    });
    setDistribucion(producto.distribucion);
    setIndiceEdicion(index);
  };

  const eliminarProducto = (index) => {
    const nuevaLista = productosLista.filter((_, i) => i !== index);
    setProductosLista(nuevaLista);
  };

  const registrarCompra = async () => {
    if (!productosLista.length) {
      alert("No se puede registrar una compra sin productos.");
      return;
    }

    if (!validarCamposPrincipales()) {
      return;
    }

    try {
      await addDoc(collection(db, "compras"), {
        ...compra,
        productos: productosLista,
      });
      alert("Compra registrada exitosamente.");
      limpiarFormulario(true);
      setProductosLista([]);
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      alert("Hubo un error al registrar la compra.");
    }
  };

  const limpiarFormulario = (resetCamposPrincipales = false) => {
    setCompra((prevState) => ({
      ...prevState,
      id_prod: "",
      presentacion: "",
      cantidad: "",
      ...(resetCamposPrincipales
        ? { fecha_compra: new Date().toISOString().split("T")[0], id_prov: "", num_factura: "" }
        : {}),
    }));
    setDistribucion({ zarzamora: 0, tabora: 0 });
    setIndiceEdicion(null);
  };

  return (
    <div className="compras-container">
      <div className="compras-form">
        <h2>Registro de Compra</h2>
        <div className="form-header">
          <label>
            Fecha:
            <input
              type="date"
              name="fecha_compra"
              value={compra.fecha_compra}
              onChange={manejarCambio}
            />
          </label>
          <label>
            Proveedor:
            <select name="id_prov" value={compra.id_prov} onChange={manejarCambio}>
              <option value="">Seleccionar</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre_prov}
                </option>
              ))}
            </select>
          </label>
          <label>
            Forma de Pago:
            <select name="forma_pago" value={compra.forma_pago} onChange={manejarCambio}>
              <option value="contado">Contado</option>
              <option value="credito">Crédito</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </label>
          <label>
            Número de Factura:
            <input
              type="text"
              name="num_factura"
              value={compra.num_factura}
              onChange={manejarCambio}
            />
          </label>
        </div>

        <div className="form-body">
          <label>
            Producto:
            <select name="id_prod" value={compra.id_prod} onChange={manejarCambio}>
              <option value="">Seleccionar Producto</option>
              {productos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre_prod}
                </option>
              ))}
            </select>
          </label>
          <label>
            Presentación:
            <select name="presentacion" value={compra.presentacion} onChange={manejarCambio}>
              <option value="">Seleccionar Presentación</option>
              {presentaciones.map((pres) => (
                <option key={pres.id} value={pres.id}>
                  {pres.nombre_presentacion}
                </option>
              ))}
            </select>
          </label>
          <label>
            Cantidad:
            <input
              type="number"
              name="cantidad"
              value={compra.cantidad}
              onChange={manejarCambio}
            />
          </label>
          <label>
            Zarzamora:
            <input
              type="number"
              name="zarzamora"
              value={distribucion.zarzamora}
              onChange={manejarCambioDistribucion}
            />
          </label>
          <label>
            Tabora:
            <input
              type="number"
              name="tabora"
              value={distribucion.tabora}
              onChange={manejarCambioDistribucion}
            />
          </label>
          <button onClick={agregarOActualizarProducto}>
            {indiceEdicion !== null ? "Actualizar Producto" : "Agregar Producto"}
          </button>
        </div>
      </div>

      <div className="productos-registrados">
        <h2>Productos Registrados</h2>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Presentación</th>
              <th>Cantidad</th>
              <th>Zarzamora</th>
              <th>Tabora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosLista.map((prod, index) => (
              <tr key={index}>
                <td>{prod.nombre_prod}</td>
                <td>{prod.presentacion}</td>
                <td>{prod.cantidad}</td>
                <td>{prod.distribucion.zarzamora}</td>
                <td>{prod.distribucion.tabora}</td>
                <td>
                  <button onClick={() => seleccionarProducto(index)}>Editar</button>
                  <button onClick={() => eliminarProducto(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="registrar-compra">
          <button onClick={registrarCompra}>Registrar Compra</button>
        </div>
      </div>
    </div>
  );
};

export default Compras;
