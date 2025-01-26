import React, { useState, useEffect, useRef } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./Producto.css";

const Producto = ({ onProductoSelect }) => {
  const [productos, setProductos] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [buscarProducto, setBuscarProducto] = useState("");
  const refProducto = useRef(null); // Referencia para el componente Producto

  // Cargar productos desde Firebase
  const cargarProductos = async () => {
    const db = getFirestore();
    const productosRef = collection(db, "productos");

    try {
      const snapshot = await getDocs(productosRef);
      const productosCargados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(productosCargados);
    } catch (error) {
      console.error("Error al cargar productos desde Firebase:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Manejar la selección del producto
  const manejarSeleccion = (producto) => {
    onProductoSelect(producto); // Llama a la función pasada desde App.js
    setBuscarProducto(producto.nombre_prod); // Muestra el nombre del producto seleccionado
    setMostrarDropdown(false); // Oculta el desplegable
  };

  // Cerrar el desplegable si haces clic fuera del componente
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (refProducto.current && !refProducto.current.contains(event.target)) {
        setMostrarDropdown(false); // Cierra el desplegable si el clic ocurre fuera
      }
    };

    document.addEventListener("mousedown", manejarClickFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, []);

  // Filtrar productos según el texto ingresado
  const productosFiltrados = productos.filter((prod) =>
    prod.nombre_prod.toLowerCase().includes(buscarProducto.toLowerCase())
  );

  return (
    <div className="producto-container" ref={refProducto}>
      <label>
        Producto:
        <input
          type="text"
          value={buscarProducto}
          onChange={(e) => {
            setBuscarProducto(e.target.value);
            setMostrarDropdown(true);
          }}
          placeholder="Buscar producto"
          onFocus={() => setMostrarDropdown(true)}
        />
      </label>

      {mostrarDropdown && productosFiltrados.length > 0 && (
        <ul className="desplegable">
          {productosFiltrados.map((prod) => (
            <li key={prod.id} onMouseDown={() => manejarSeleccion(prod)}>
              {prod.nombre_prod}
            </li>
          ))}
        </ul>
      )}

      {mostrarDropdown && productosFiltrados.length === 0 && (
        <p>No se encontraron productos.</p>
      )}
    </div>
  );
};

export default Producto;
