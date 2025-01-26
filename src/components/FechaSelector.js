import React, { useState, useEffect } from "react";

const FechaSelector = ({ onFechaChange }) => {
  const [fecha, setFecha] = useState("");

  // Obtener la fecha actual al cargar el componente
  useEffect(() => {
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    setFecha(fechaFormateada);

    // Notificar la fecha inicial al componente padre
    if (onFechaChange) {
      onFechaChange(fechaFormateada);
    }
  }, [onFechaChange]);

  // Manejar cambios en el selector de fecha
  const manejarCambioFecha = (e) => {
    const nuevaFecha = e.target.value;
    setFecha(nuevaFecha);

    // Notificar la nueva fecha al componente padre
    if (onFechaChange) {
      onFechaChange(nuevaFecha);
    }
  };

  return (
    <div className="fecha-selector-container">
      <label htmlFor="fecha-selector">Fecha de Compra:</label>
      <input
        id="fecha-selector"
        type="date"
        value={fecha}
        onChange={manejarCambioFecha}
      />
    </div>
  );
};

export default FechaSelector;
