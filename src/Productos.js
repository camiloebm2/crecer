import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Solo se importa lo necesario
import db from "./firebase"; // Configuración de Firebase
import "./productos.css"; // Archivo de estilos

// Función para consultar productos desde Firestore
export const consultarProductos = async () => {
  try {
    const productosRef = collection(db, "productos");
    const querySnapshot = await getDocs(productosRef);

    const productos = [];
    querySnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() });
    });

    console.log("Productos consultados:", productos);
    return productos;
  } catch (error) {
    console.error("Error consultando productos:", error);
    throw error;
  }
};

// Componente React para mostrar productos
const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await consultarProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    cargarProductos();
  }, []);

  return (
    <div className="productos-container">
      <h1>Lista de Productos</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre_prod || "Producto sin nombre"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;
