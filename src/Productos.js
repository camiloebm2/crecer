import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import db from "./firebase"; // Asegúrate de que este archivo tenga la configuración correcta
import "./productos.css"; // Estilos para el componente

// Función de consulta: Obtener todos los productos
export const consultarProductos = async () => {
  try {
    const productosRef = collection(db, "productos"); // Referencia a la colección
    const q = query(productosRef); // Puedes personalizar la consulta si es necesario
    const querySnapshot = await getDocs(q);

    const productos = [];
    querySnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() });
    });

    console.log("Productos consultados:", productos);
    return productos; // Devuelve los productos
  } catch (error) {
    console.error("Error consultando productos:", error);
    throw error;
  }
};

// Componente React: Mostrar productos
const Productos = () => {
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await consultarProductos(); // Llamada a la función de consulta
        setProductos(data); // Actualizar el estado
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    cargarProductos(); // Cargar productos al montar el componente
  }, []); // Dependencia vacía para que se ejecute solo una vez

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

export default Productos; // Exportación del componente React
