import React, { useState } from "react";
import FechaSelector from "./FechaSelector";
import Proveedor from "./Proveedor";
import Producto from "./Producto";
import TablaProductos from "./TablaProductos";
import "./DynamicInput.css"; // Asegúrate de que exista este archivo de estilos

const DynamicInput = ({ label, type = "text", value, onChange, options = [] }) => {
  return (
    <div className="dynamic-input">
      <label>
        {label}
        {type === "select" ? (
          <select value={value} onChange={onChange}>
            <option value="">Seleccionar</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nombre}
              </option>
            ))}
          </select>
        ) : (
          <input type={type} value={value} onChange={onChange} />
        )}
      </label>
    </div>
  );
};

export default DynamicInput;
