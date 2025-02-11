import React, { useState, useEffect, useCallback } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../firebase";

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

const TablaPresentacionesInactivas = ({ cerrarModal, productoId }) => {
  const [presentacionesInactivas, setPresentacionesInactivas] = useState([]);

  // Corrección: Se usa useCallback para evitar warning en useEffect
  const cargarPresentacionesInactivas = useCallback(async () => {
    if (productoId) {
      const productoRef = doc(db, "productos", productoId);
      const productoSnap = await getDoc(productoRef);
      if (productoSnap.exists()) {
        const data = productoSnap.data();
        const inactivas = PRESENTACIONES.filter((tipo) => data[tipo] === "inactivo");
        setPresentacionesInactivas(inactivas);
      }
    }
  }, [productoId]);

  useEffect(() => {
    cargarPresentacionesInactivas();
  }, [cargarPresentacionesInactivas]); // ✅ Agregamos la función como dependencia para evitar el warning

  const activarPresentacion = async (presentacion) => {
    try {
      const productoRef = doc(db, "productos", productoId);
      await updateDoc(productoRef, {
        [presentacion]: "activo",
      });

      // Eliminar la presentación activada de la lista de inactivas
      setPresentacionesInactivas((prev) => prev.filter((p) => p !== presentacion));
    } catch (error) {
      console.error("Error al activar presentación:", error);
    }
  };

  return (
    <div className="tabla-presentaciones-inactivas">
      <h3>Presentaciones Inactivas</h3>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {presentacionesInactivas.map((tipo) => (
            <tr key={tipo}>
              <td>{tipo}</td>
              <td>
                <button className="btn-activar" onClick={() => activarPresentacion(tipo)}>
                  Activar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-cerrar" onClick={cerrarModal}>
        Cerrar
      </button>
    </div>
  );
};

export default TablaPresentacionesInactivas;
