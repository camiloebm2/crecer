import React, { useEffect, useState } from "react";
import InputNumerico from "./InputNumerico";

const UtilidadInput = ({ producto, cambios, manejarCambio }) => {
  const [utilidad, setUtilidad] = useState(
    cambios[producto.id]?.utilidad ??
    (producto.precio_compra > 0 ? producto.utilidad_sug ?? 0 : 0)
  );

  useEffect(() => {
    if (producto.precio_compra > 0) {
      setUtilidad(cambios[producto.id]?.utilidad ?? producto.utilidad_sug ?? 0);
    }
  }, [producto, cambios]);

  const handleUtilidadChange = (value) => {
    setUtilidad(value);
    if (producto.precio_compra > 0) {
      const nuevoPrecio = (producto.precio_compra * (1 + value / 100)).toFixed(2);
      manejarCambio(producto.id, "nuevoPrecio", nuevoPrecio);
    }
    manejarCambio(producto.id, "utilidad", value);
  };

  return (
    <InputNumerico
      value={utilidad}
      onChange={handleUtilidadChange}
      placeholder="Ingrese utilidad (%)"
    />
  );
};

export default UtilidadInput;
