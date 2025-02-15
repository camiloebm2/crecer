import React from "react";
import PropTypes from "prop-types";

const FiltroProductos = ({ filtro, setFiltro }) => {
  return (
    <div className="filtro-container">
      <label>Filtrar:</label>
      <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
        <option value="todos">Todos los productos</option>
        <option value="con_compra">Productos con compra (hoy)</option>
      </select>
    </div>
  );
};

FiltroProductos.propTypes = {
  filtro: PropTypes.string.isRequired,
  setFiltro: PropTypes.func.isRequired,
};

export default FiltroProductos;
