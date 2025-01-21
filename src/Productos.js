import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "./firebase"; // Archivo de configuración de Firebase
import * as XLSX from "xlsx";
import "./productos.css"; // Estilos para el componente

// Función: Agregar productos de forma masiva
export const agregarProductosMasivos = async (productos) => {
  try {
    const productosRef = collection(db, "productos"); // Referencia a la colección
    const batchPromises = productos.map(async (producto) => {
      await addDoc(productosRef, producto); // Añade cada producto
    });

    await Promise.all(batchPromises); // Espera a que se completen todas las operaciones
    console.log("Productos agregados de forma masiva.");
  } catch (error) {
    console.error("Error agregando productos de forma masiva:", error);
    throw error;
  }
};

// Componente React
const Productos = () => {
  const [productosExcel, setProductosExcel] = useState([]); // Estado para almacenar los productos del Excel
  const [archivoCargado, setArchivoCargado] = useState(null); // Estado para el archivo cargado

  // Estructura esperada de los productos
  const estructuraEsperada = [
    "calidad",
    "cod_pos",
    "forma_venta",
    "id_forma_venta",
    "id_grupo",
    "id_linea",
    "id_prod",
    "id_siigo",
    "nombre_prod",
    "precioc_uni",
    "preciov_uni",
    "presentacion",
    "saldo",
    "unidad",
  ];

  // Función para procesar el archivo Excel
  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (evento) => {
      const datos = new Uint8Array(evento.target.result);
      const libro = XLSX.read(datos, { type: "array" });
      const hoja = libro.Sheets[libro.SheetNames[0]]; // Primera hoja del archivo
      const productos = XLSX.utils.sheet_to_json(hoja); // Convierte a JSON

      // Validar estructura
      const productosValidados = productos.filter((producto) => {
        return estructuraEsperada.every((campo) => campo in producto);
      });

      if (productosValidados.length !== productos.length) {
        alert(
          "Algunos productos no tienen la estructura esperada y fueron omitidos."
        );
      }

      console.log("Productos validados:", productosValidados);
      setProductosExcel(productosValidados); // Almacena los productos validados
    };
    lector.readAsArrayBuffer(archivo); // Lee el archivo como ArrayBuffer
    setArchivoCargado(archivo);
  };

  // Función para enviar los productos a Firestore
  const cargarProductosEnFirestore = async () => {
    if (productosExcel.length === 0) {
      alert("No hay productos para cargar.");
      return;
    }

    try {
      await agregarProductosMasivos(productosExcel); // Llama a la función masiva
      alert("Productos cargados exitosamente.");
      setProductosExcel([]); // Limpia los productos
      setArchivoCargado(null); // Limpia el archivo
    } catch (error) {
      console.error("Error al cargar productos:", error);
      alert("Error al cargar productos. Revisa la consola para más detalles.");
    }
  };

  return (
    <div className="productos-container">
      <h1>Productos: Importar desde Excel</h1>

      <input type="file" accept=".xlsx, .xls" onChange={manejarArchivo} />
      <button
        onClick={cargarProductosEnFirestore}
        disabled={!archivoCargado || productosExcel.length === 0}
      >
        Cargar productos a Firestore
      </button>

      <ul>
        {productosExcel.map((producto, index) => (
          <li key={index}>
            {JSON.stringify(producto)} {/* Muestra cada producto cargado */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;
