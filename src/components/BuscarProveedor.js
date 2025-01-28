import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const BuscarProveedor = ({ onProveedorSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setProveedores([
      { id: "001", nombre_prov: "Proveedor A" },
      { id: "002", nombre_prov: "Proveedor B" },
      { id: "003", nombre_prov: "Proveedor C" },
    ]);
  }, []);

  useEffect(() => {
    console.log("Proveedor seleccionado en BuscarProveedor:", searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toUpperCase());
    setShowSuggestions(true);
  };

  const handleSelect = (proveedor) => {
    console.log("Proveedor seleccionado antes de enviar a Compras:", proveedor);
    onProveedorSelect({ nombre: proveedor.nombre_prov, id: proveedor.id });
    setSearchTerm(proveedor.nombre_prov);
    setShowSuggestions(false);
  };

  return (
    <div className="buscar-proveedor">
      <label>Buscar Proveedor:</label>
      <input
        type="text"
        placeholder="Ingrese nombre o ID del proveedor"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && searchTerm && (
        <ul className="proveedor-suggestions">
          {proveedores
            .filter(
              (p) =>
                p.nombre_prov.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.includes(searchTerm)
            )
            .map((p) => (
              <li key={p.id} onClick={() => handleSelect(p)}>
                {p.id} - {p.nombre_prov}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

BuscarProveedor.propTypes = {
  onProveedorSelect: PropTypes.func.isRequired,
};

export default BuscarProveedor;
