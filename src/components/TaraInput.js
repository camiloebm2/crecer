import React from "react";
import PropTypes from "prop-types";
import InputNumerico from "./InputNumerico";

const TaraInput = ({ producto, cambios, manejarCambio }) => {
  const tara = cambios[producto.id]?.tara ?? producto.tara ?? 1;

  return (
    <InputNumerico
      value={tara}
      onChange={(value) => {
        manejarCambio(producto.id, "tara", value);
        manejarCambio(producto.id, "zarzamoraUnidades", (producto.cant_zarza || 0) * value);
        manejarCambio(producto.id, "taboraUnidades", (producto.cant_tab || 0) * value);
      }}
      placeholder="Ingrese Tara"
    />
  );
};

TaraInput.propTypes = {
  producto: PropTypes.object.isRequired,
  cambios: PropTypes.object.isRequired,
  manejarCambio: PropTypes.func.isRequired,
};

export default TaraInput;
