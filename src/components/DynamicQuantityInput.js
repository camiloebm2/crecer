import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputNumerico from "./InputNumerico";

const DynamicQuantityInput = ({ totalQuantity, zarzamora, tabora, onChange }) => {
  const [inputValues, setInputValues] = useState({
    zarzamora: zarzamora.toString(),
    tabora: tabora.toString(),
  });

  useEffect(() => {
    // Actualiza los valores locales si el total o los valores cambian desde el padre
    setInputValues({
      zarzamora: zarzamora.toString(),
      tabora: tabora.toString(),
    });
  }, [totalQuantity, zarzamora, tabora]);

  const parseNumber = (value) => {
    const numericValue = parseFloat(value.replace(/,/g, "")) || 0;
    return Math.max(0, numericValue); // Evita valores negativos
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleZarzamoraChange = (value) => {
    const numericValue = parseNumber(value);

    // Si el valor excede el total, ajustarlo
    if (numericValue > totalQuantity) {
      setInputValues((prev) => ({
        ...prev,
        zarzamora: formatNumber(totalQuantity),
        tabora: "0.00",
      }));
      onChange({ zarzamora: totalQuantity, tabora: 0 });
      return;
    }

    // Calcular el restante y actualizar dinámicamente
    const remaining = Math.max(0, parseFloat((totalQuantity - numericValue).toFixed(2)));
    setInputValues((prev) => ({
      ...prev,
      zarzamora: value,
      tabora: formatNumber(remaining),
    }));
    onChange({ zarzamora: numericValue, tabora: remaining });
  };

  const handleTaboraChange = (value) => {
    const numericValue = parseNumber(value);

    // Si el valor excede el total, ajustarlo
    if (numericValue > totalQuantity) {
      setInputValues((prev) => ({
        ...prev,
        tabora: formatNumber(totalQuantity),
        zarzamora: "0.00",
      }));
      onChange({ zarzamora: 0, tabora: totalQuantity });
      return;
    }

    // Calcular el restante y actualizar dinámicamente
    const remaining = Math.max(0, parseFloat((totalQuantity - numericValue).toFixed(2)));
    setInputValues((prev) => ({
      ...prev,
      tabora: value,
      zarzamora: formatNumber(remaining),
    }));
    onChange({ zarzamora: remaining, tabora: numericValue });
  };

  return (
    <div className="dynamic-quantity-input">
      <div>
        <InputNumerico
          label="Cantidad Zarzamora"
          value={inputValues.zarzamora}
          onChange={handleZarzamoraChange}
          onBlur={() =>
            setInputValues((prev) => ({
              ...prev,
              zarzamora: formatNumber(parseNumber(prev.zarzamora)),
            }))
          }
          placeholder="Ingrese cantidad para Zarzamora"
        />
      </div>
      <div>
        <InputNumerico
          label="Cantidad Tabora"
          value={inputValues.tabora}
          onChange={handleTaboraChange}
          onBlur={() =>
            setInputValues((prev) => ({
              ...prev,
              tabora: formatNumber(parseNumber(prev.tabora)),
            }))
          }
          placeholder="Ingrese cantidad para Tabora"
        />
      </div>
    </div>
  );
};

DynamicQuantityInput.propTypes = {
  totalQuantity: PropTypes.number.isRequired,
  zarzamora: PropTypes.number.isRequired,
  tabora: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DynamicQuantityInput;
