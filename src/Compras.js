import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import db from "./firebase"; // Archivo de configuración de Firebase
import "./compras.css"; // Estilos del componente

const Compras = () => {
  const [proveedores, setProveedores] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [compra, setCompra] = useState({
    calidad: "",
    fecha_compra: "",
    forma_pago: "",
    id_prod: "",
    id_prov: "",
    id_pto_vta: "",
    presentacion: "",
    ref_fact: "",
    und: "",
  });

  // Cargar proveedores y presentaciones al montar el componente
  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const proveedoresSnapshot = await getDocs(collection(db, "proveedores"));
        const listaProveedores = proveedoresSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre_prov: doc.data().nombre_prov,
        }));
        setProveedores(listaProveedores);
      } catch (error) {
        console.error("Error cargando proveedores:", error);
      }
    };

    const cargarPresentaciones = async () => {
      try {
        const presentacionesSnapshot = await getDocs(collection(db, "presentacion"));
        const listaPresentaciones = presentacionesSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre_presentacion: doc.data().nombre_presentacion,
        }));
        setPresentaciones(listaPresentaciones);
      } catch (error) {
        console.error("Error cargando presentaciones:", error);
      }
    };

    cargarProveedores();
    cargarPresentaciones();
  }, []);

  // Manejar cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCompra((prevState) => ({ ...prevState, [name]: value }));
  };

  // Guardar la compra en la colección
  const registrarCompra = async () => {
    try {
      await addDoc(collection(db, "compras"), compra);
      alert("Compra registrada exitosamente.");
      setCompra({
        calidad: "",
        fecha_compra: "",
        forma_pago: "",
        id_prod: "",
        id_prov: "",
        id_pto_vta: "",
        presentacion: "",
        ref_fact: "",
        und: "",
      });
    } catch (error) {
      console.error("Error registrando la compra:", error);
      alert("Hubo un error al registrar la compra.");
    }
  };

  return (
    <div className="compras-container">
      <h1>Registrar Compra</h1>
      <form>
        <label>
          Calidad:
          <input
            type="number"
            name="calidad"
            value={compra.calidad}
            onChange={manejarCambio}
            required
          />
        </label>

        <label>
          Fecha de Compra:
          <input
            type="text"
            name="fecha_compra"
            value={compra.fecha_compra}
            onChange={manejarCambio}
            required
          />
        </label>

        <label>
          Forma de Pago:
          <input
            type="text"
            name="forma_pago"
            value={compra.forma_pago}
            onChange={manejarCambio}
            required
          />
        </label>

        <label>
          ID del Producto:
          <input
            type="number"
            name="id_prod"
            value={compra.id_prod}
            onChange={manejarCambio}
            required
          />
        </label>

        <label>
          Proveedor:
          <select
            name="id_prov"
            value={compra.id_prov}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre_prov}
              </option>
            ))}
          </select>
        </label>

        <label>
          ID del Punto de Venta:
          <input
            type="number"
            name="id_pto_vta"
            value={compra.id_pto_vta}
            onChange={manejarCambio}
            required
          />
        </label>

        <label>
          Presentación:
          <select
            name="presentacion"
            value={compra.presentacion}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccionar presentación</option>
            {presentaciones.map((pres) => (
              <option key={pres.id} value={pres.id}>
                {pres.nombre_presentacion}
              </option>
            ))}
          </select>
        </label>

        <label>
          Referencia Factura:
          <input
            type="number"
            name="ref_fact"
            value={compra.ref_fact}
            onChange={manejarCambio}
            required
          />
        </label>

        <label>
          Unidad:
          <input
            type="number"
            name="und"
            value={compra.und}
            onChange={manejarCambio}
            required
          />
        </label>

        <button type="button" onClick={registrarCompra}>
          Registrar Compra
        </button>
      </form>
    </div>
  );
};

export default Compras;
