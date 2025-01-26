import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [proveedores, setProveedores] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [detallesCompra, setDetallesCompra] = useState({
    fecha_compra: new Date().toISOString().split("T")[0],
    forma_pago: "",
    id_prov: "",
    num_factura: "",
  });

  const actualizarDetallesCompra = (campo, valor) => {
    setDetallesCompra((prevState) => ({
      ...prevState,
      [campo]: valor,
    }));
  };

  const agregarProductoSeleccionado = (producto) => {
    setProductosSeleccionados((prevState) => [...prevState, producto]);
  };

  const eliminarProductoSeleccionado = (id) => {
    setProductosSeleccionados((prevState) =>
      prevState.filter((producto) => producto.id !== id)
    );
  };

  const cargarDatosIniciales = async (fetchFunction) => {
    try {
      const [proveedoresData, presentacionesData, productosData] = await fetchFunction();
      setProveedores(proveedoresData);
      setPresentaciones(presentacionesData);
      setProductos(productosData);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        proveedores,
        presentaciones,
        productos,
        productosSeleccionados,
        detallesCompra,
        actualizarDetallesCompra,
        agregarProductoSeleccionado,
        eliminarProductoSeleccionado,
        cargarDatosIniciales,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
