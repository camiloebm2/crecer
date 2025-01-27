import React from "react";
import PropTypes from "prop-types";

const InputNumerico = ({ label, value, onChange, placeholder }) => {
  const formatValue = (num) => {
    if (num === "" || num === null || num === undefined) return "";
    const [integer, decimal] = num.toString().split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Agregar comas
    return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Quitar comas antes de procesar

    // Permitir solo números y hasta 2 decimales
    if (/^\d*\.?\d{0,2}$/.test(rawValue)) {
      // Evitar ceros iniciales innecesarios, excepto si es "0."
      if (rawValue.startsWith("0") && rawValue.length > 1 && rawValue[1] !== ".") {
        onChange(rawValue.replace(/^0+/, ""));
      } else {
        onChange(rawValue);
      }
    }
  };

  return (
    <div className="input-numerico">
      <label>{label}</label>
      <input
        type="text"
        value={formatValue(value)} // Formatear el número con comas y punto decimal
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </div>
  );
};

InputNumerico.propTypes = {
  label: PropTypes.string.isRequired, // Etiqueta del campo
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Valor actual
  onChange: PropTypes.func.isRequired, // Función para manejar cambios
  placeholder: PropTypes.string, // Texto de marcador de posición
};

export default InputNumerico;
