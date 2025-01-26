import React, { useState } from "react";
import PropTypes from "prop-types";

// Formatear número con comas y máximo 2 decimales
const formatNumber = (num) => {
  if (num === "" || num === undefined) return "";
  const [integerPart, decimalPart] = parseFloat(num)
    .toFixed(2) // Asegura que tenga máximo 2 decimales
    .split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Agrega comas
  return decimalPart === "00" ? formattedInteger : `${formattedInteger}.${decimalPart}`;
};

const InputNumerico = ({ label, value, onChange, placeholder = "" }) => {
  const [inputValue, setInputValue] = useState(value ? formatNumber(value) : "");

  const manejarCambio = (e) => {
    let nuevoValor = e.target.value;

    // Permitir solo números, punto y eliminar comas
    nuevoValor = nuevoValor.replace(/,/g, "");

    // Validar que sea un número válido con punto decimal
    if (!/^\d*\.?\d{0,2}$/.test(nuevoValor) && nuevoValor !== "") {
      return; // No actualizar si no cumple el patrón
    }

    // Actualizar el estado visual sin formatear
    setInputValue(nuevoValor);

    // Convertir a número y notificar al padre
    const valorNumerico = parseFloat(nuevoValor);
    if (!isNaN(valorNumerico)) {
      onChange(valorNumerico); // Enviar el valor numérico al padre
    } else {
      onChange(""); // Si está vacío, enviar vacío al padre
    }
  };

  const manejarBlur = () => {
    // Al perder el foco, formatear el valor si no está vacío
    if (inputValue !== "") {
      const valorFormateado = formatNumber(inputValue);
      setInputValue(valorFormateado);
    }
  };

  return (
    <div className="input-numerico-container">
      {label && <label>{label}</label>}
      <input
        type="text"
        value={inputValue}
        onChange={manejarCambio}
        onBlur={manejarBlur} // Formatear al perder el foco
        placeholder={placeholder}
        inputMode="decimal" // Mostrar teclado numérico en móviles
      />
    </div>
  );
};

// Validar las props
InputNumerico.propTypes = {
  label: PropTypes.string, // Etiqueta opcional
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Valor inicial
  onChange: PropTypes.func.isRequired, // Función para manejar cambios
  placeholder: PropTypes.string, // Placeholder opcional
};

export default InputNumerico;
