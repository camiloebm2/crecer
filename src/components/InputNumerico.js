import React from "react";
import PropTypes from "prop-types";

const InputNumerico = ({ label, value, onChange, placeholder }) => {
  const formatValue = (num) => {
    if (num === "" || num === null || num === undefined) return "";
    const numStr = num.toString().replace(/,/g, "");
    const [integer, decimal] = numStr.split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
  };

  const handleInputChange = (e) => {
    let rawValue = e.target.value.replace(/,/g, "");

    const isNegativeAllowed = label === "Utilidad (%)";

    if (/^-?\d*\.?\d{0,2}$/.test(rawValue) || rawValue === "") {
      if (rawValue.startsWith("0") && rawValue.length > 1 && rawValue[1] !== ".") {
        rawValue = rawValue.replace(/^0+/, "");
      }
      if (rawValue.startsWith("-") && !isNegativeAllowed) {
        return;
      }
      onChange(rawValue);
    }
  };

  return (
    <div className="input-numerico">
      {label && <label>{label}</label>}
      <input
        type="text"
        value={formatValue(value)}
        onChange={handleInputChange}
        placeholder={placeholder || "Ingrese un valor"}
      />
    </div>
  );
};

InputNumerico.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default InputNumerico;
