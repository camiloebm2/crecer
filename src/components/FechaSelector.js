import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const FechaSelector = ({ value, onFechaChange }) => {
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const obtenerFechaLocalExacta = () => {
      const hoy = new Date(); // Fecha actual
      hoy.setHours(0, 0, 0, 0); // Reiniciar horas a las 00:00:00 para evitar desajustes
      const anio = hoy.getFullYear();
      const mes = String(hoy.getMonth() + 1).padStart(2, "0");
      const dia = String(hoy.getDate()).padStart(2, "0");
      return `${anio}-${mes}-${dia}`; // Formato YYYY-MM-DD
    };

    const fechaInicial = value || obtenerFechaLocalExacta();
    setFecha(fechaInicial); // Establecer la fecha inicial
  }, [value]);

  const handleChange = (e) => {
    const nuevaFecha = e.target.value;
    setFecha(nuevaFecha); // Actualizar la fecha seleccionada
    onFechaChange(nuevaFecha); // Notificar al componente padre
  };

  return (
    <div className="fecha-selector">
      <label htmlFor="fecha">Fecha de Compra:</label>
      <input
        type="date"
        id="fecha"
        value={fecha}
        onChange={handleChange}
      />
    </div>
  );
};

FechaSelector.propTypes = {
  value: PropTypes.string, // Fecha inicial en formato YYYY-MM-DD
  onFechaChange: PropTypes.func.isRequired, // Función para manejar cambios de fecha
};

export default FechaSelector;
