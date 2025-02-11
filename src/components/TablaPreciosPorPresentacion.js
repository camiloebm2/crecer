import React, { useState, useEffect, useCallback } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import db from "../firebase";
import TablaPresentacionesInactivas from "./TablaPresentacionesInactivas";
import "./TablaPreciosPorPresentacion.css";

const PRESENTACIONES = [
  "malla",
  "2000",
  "3000",
  "bandeja",
  "entero",
  "bulto",
  "medio_bulto",
  "canastilla",
  "bolsa",
  "docena",
  "oferta",
];

const TablaPreciosPorPresentacion = ({ producto }) => {
  const [presentacionesActivas, setPresentacionesActivas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Corrección: useCallback para evitar que la función cambie en cada render
  const cargarPresentacionesActivas = useCallback(async () => {
    if (producto) {
      const productoRef = doc(db, "productos", producto.id);
      const productoSnap = await getDoc(productoRef);
      if (productoSnap.exists()) {
        const data = productoSnap.data();
        const activas = PRESENTACIONES.filter((tipo) => data[tipo] === "activo");
        setPresentacionesActivas(activas);
      }
    }
  }, [producto]);

  useEffect(() => {
    cargarPresentacionesActivas();
  }, [cargarPresentacionesActivas]); // ✅ Agregamos la función como dependencia

  const desactivarPresentacion = async (presentacion) => {
    try {
      const productoRef = doc(db, "productos", producto.id);
      await updateDoc(productoRef, {
        [presentacion]: "inactivo",
      });

      setPresentacionesActivas((prev) => prev.filter((p) => p !== presentacion));
    } catch (error) {
      console.error("Error al desactivar presentación:", error);
    }
  };

  const actualizarDesdeModal = () => {
    setMostrarModal(false);
    cargarPresentacionesActivas(); // Recargar la tabla cuando se active una presentación
  };

  return (
    <div className="tabla-presentaciones">
      <h3>Precios por Presentación de {producto.nombre_prod}</h3>
      <button className="btn-activar" onClick={() => setMostrarModal(true)}>
        Activar Presentaciones
      </button>

      {mostrarModal && (
        <TablaPresentacionesInactivas
          cerrarModal={actualizarDesdeModal} // Se actualiza la tabla después de activar una presentación
          productoId={producto.id}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {presentacionesActivas.map((tipo) => (
            <tr key={tipo}>
              <td>{tipo}</td>
              <td>
                <input type="number" placeholder={`Ingrese precio para ${tipo}`} />
              </td>
              <td>
                <button
                  className="btn-desactivar"
                  onClick={() => desactivarPresentacion(tipo)}
                >
                  Desactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPreciosPorPresentacion;
