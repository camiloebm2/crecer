import React from "react";
import PropTypes from "prop-types";
import "./TablaProductos.css"; 

const TablaProductos = ({ columnas, datos, acciones }) => {
  return (
    <table className="tabla-productos">
      <thead>
        <tr>
          {columnas.map((columna, index) => (
            <th key={index}>{columna.titulo}</th>
          ))}
          {acciones && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {datos.map((fila, index) => (
          <tr key={index}>
            {columnas.map((columna, i) => (
              <td key={i}>{fila[columna.campo]}</td>
            ))}
            {acciones && (
              <td>
                {acciones.map((accion, i) => (
                  <button
                    key={i}
                    className={accion.clase}
                    onClick={() => accion.onClick(fila)}
                  >
                    {accion.texto}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

TablaProductos.propTypes = {
  columnas: PropTypes.arrayOf(
    PropTypes.shape({
      titulo: PropTypes.string.isRequired,
      campo: PropTypes.string.isRequired,
    })
  ).isRequired,
  datos: PropTypes.arrayOf(PropTypes.object).isRequired,
  acciones: PropTypes.arrayOf(
    PropTypes.shape({
      texto: PropTypes.string.isRequired,
      clase: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    })
  ),
};

export default TablaProductos;
