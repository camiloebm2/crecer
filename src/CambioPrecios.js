import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "./firebase";
import FiltroProductos from "./components/FiltroProductos";
import TablaProductos from "./components/TablaProductos";
import "./CambioPrecios.css";

const CambioPrecios = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [cambios, setCambios] = useState({});

  const fechaHoy = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const productosArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosArray);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    cargarProductos();
  }, []);

  const manejarCambio = (id, campo, valor) => {
    setCambios((prev) => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor },
    }));
  };

  const guardarCambios = async () => {
    try {
      const actualizaciones = Object.keys(cambios).map(async (id) => {
        const productoRef = doc(db, "productos", id);
        await updateDoc(productoRef, cambios[id]);
      });

      await Promise.all(actualizaciones);
      alert("Cambios guardados exitosamente.");
      setCambios({});
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    if (filtro === "con_compra") {
      return producto.fecha_compra === fechaHoy;
    }
    return true;
  });

  return (
    <div className="cambio-precios-container">
      <h1>Cambio de Precios</h1>
      <FiltroProductos filtro={filtro} setFiltro={setFiltro} />
      <TablaProductos productos={productosFiltrados} cambios={cambios} manejarCambio={manejarCambio} fechaHoy={fechaHoy} />
      <button className="btn-guardar" onClick={guardarCambios} disabled={Object.keys(cambios).length === 0}>
        Guardar Cambios
      </button>
    </div>
  );
};

export default CambioPrecios;
