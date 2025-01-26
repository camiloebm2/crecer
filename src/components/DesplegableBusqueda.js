import React from "react";
import PropTypes from "prop-types";
import "./DesplegableBusqueda.css";

const DesplegableBusqueda = ({
  placeholder,
  value,
  onChange,
  options,
  onOptionSelect,
  showDropdown,
}) => {
  return (
    <div className="desplegable-busqueda-container">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="desplegable-busqueda-input"
      />
      {showDropdown && options.length > 0 && (
        <ul className="desplegable-busqueda-lista">
          {options.map((option) => (
            <li
              key={option.id}
              onMouseDown={() => onOptionSelect(option)}
              className="desplegable-busqueda-item"
            >
              {option.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

DesplegableBusqueda.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  showDropdown: PropTypes.bool.isRequired,
};

export default DesplegableBusqueda;
