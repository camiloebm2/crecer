import React from "react";

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

export default FiltroProductos;
