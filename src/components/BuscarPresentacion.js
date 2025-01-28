import React, { useState } from "react";
import PropTypes from "prop-types";
import "./DesplegableBusqueda.css"; // Usamos el mismo estilo que el de proveedores

const presentacionesDisponibles = [
  "ATADO",
  "BANDEJA",
  "BOLSA",
  "BULTO",
  "CAJA",
  "CANASTILLA",
  "DOCENA",
  "HUACAL",
  "KILO",
  "MALLA",
  "PAQUETE",
  "UNIDAD",
];

const BuscarPresentacion = ({ onPresentacionSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toUpperCase());
    setShowSuggestions(true);
  };

  const handleSelect = (presentacion) => {
    onPresentacionSelect(presentacion);
    setSearchTerm(presentacion);
    setShowSuggestions(false);
  };

  const presentacionesFiltradas = presentacionesDisponibles.filter((p) =>
    p.includes(searchTerm)
  );

  return (
    <div className="desplegable-busqueda-container">
      <label>Buscar Presentación:</label>
      <input
        type="text"
        placeholder="Ingrese tipo de presentación"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setShowSuggestions(true)}
        className="desplegable-busqueda-input"
      />
      {showSuggestions && searchTerm && (
        <ul className="desplegable-busqueda-lista">
          {presentacionesFiltradas.map((p) => (
            <li key={p} onClick={() => handleSelect(p)} className="desplegable-busqueda-item">
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

BuscarPresentacion.propTypes = {
  onPresentacionSelect: PropTypes.func.isRequired,
};

export default BuscarPresentacion;
