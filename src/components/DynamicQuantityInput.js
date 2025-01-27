import React from "react";
import PropTypes from "prop-types";
import InputNumerico from "./InputNumerico";

const DynamicQuantityInput = ({ totalQuantity, zarzamora, tabora, onChange }) => {
  const handleZarzamoraChange = (value) => {
    const numericValue = parseFloat(value) || 0; // Convertir el valor a número
    if (numericValue <= totalQuantity) {
      const remaining = Math.max(0, parseFloat((totalQuantity - numericValue).toFixed(2))); // Calcular el restante con 2 decimales
      onChange({ zarzamora: numericValue, tabora: remaining });
    } else {
      onChange({ zarzamora: totalQuantity, tabora: 0 });
    }
  };

  const handleTaboraChange = (value) => {
    const numericValue = parseFloat(value) || 0; // Convertir el valor a número
    if (numericValue <= totalQuantity) {
      const remaining = Math.max(0, parseFloat((totalQuantity - numericValue).toFixed(2))); // Calcular el restante con 2 decimales
      onChange({ zarzamora: remaining, tabora: numericValue });
    } else {
      onChange({ zarzamora: 0, tabora: totalQuantity });
    }
  };

  return (
    <div className="dynamic-quantity-input">
      <div>
        <InputNumerico
          label="Cantidad Zarzamora"
          value={zarzamora}
          onChange={handleZarzamoraChange}
          placeholder="Ingrese cantidad para Zarzamora"
        />
      </div>
      <div>
        <InputNumerico
          label="Cantidad Tabora"
          value={tabora}
          onChange={handleTaboraChange}
          placeholder="Ingrese cantidad para Tabora"
        />
      </div>
    </div>
  );
};

DynamicQuantityInput.propTypes = {
  totalQuantity: PropTypes.number.isRequired, // Cantidad total máxima
  zarzamora: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Valor actual de Zarzamora
  tabora: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Valor actual de Tabora
  onChange: PropTypes.func.isRequired, // Función para notificar cambios al padre
};

export default DynamicQuantityInput;
