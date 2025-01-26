import React from "react";
import PropTypes from "prop-types";

const EntradaDatos = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  disabled = false,
  options = [],
  placeholder = "",
  isDropdown = false,
  showDropdown = false,
  filteredOptions = [],
  onOptionSelect = () => {},
}) => {
  return (
    <div className="entrada-datos-container">
      <label>
        {label}
        {isDropdown ? (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
          />
        ) : (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
          >
            <option value="">Seleccionar</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nombre}
              </option>
            ))}
          </select>
        )}
      </label>
      {isDropdown && showDropdown && (
        <ul className="desplegable">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              onMouseDown={() => onOptionSelect(option)}
            >
              {option.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

EntradaDatos.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  isDropdown: PropTypes.bool,
  showDropdown: PropTypes.bool,
  filteredOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  onOptionSelect: PropTypes.func,
};

export default EntradaDatos;
