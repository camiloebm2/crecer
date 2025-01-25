import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore"; // Firebase
import db from "./firebase"; // Configuración de Firebase
import * as XLSX from "xlsx"; // Librería para trabajar con Excel
import "./gestorColecciones.css"; // Archivo de estilos

const GestorColecciones = () => {
  const [colecciones, setColecciones] = useState([
    "canastillas",
    "cliente",
    "compras",
    "contable",
    "precios_por_punto",
    "presentacion",
    "productos",
    "proveedores",
    "punto_venta",
    "trabajadores",
    "usuario",
  ]); // Lista de colecciones
  const [datosColeccion, setDatosColeccion] = useState([]);
  const [estructura, setEstructura] = useState([]);
  const [coleccionSeleccionada, setColeccionSeleccionada] = useState("");
  const [nuevaColeccion, setNuevaColeccion] = useState("");

  useEffect(() => {
    const cargarDatosColeccion = async () => {
      if (coleccionSeleccionada) {
        try {
          const coleccionRef = collection(db, coleccionSeleccionada);
          const querySnapshot = await getDocs(coleccionRef);

          const datos = [];
          querySnapshot.forEach((doc) => {
            datos.push({ id: doc.id, ...doc.data() });
          });

          setDatosColeccion(datos);

          // Obtener estructura de la colección
          if (datos.length > 0) {
            setEstructura(Object.keys(datos[0]));
          } else {
            setEstructura(["id", "campo1", "campo2"]); // Predeterminada si está vacía
          }
        } catch (error) {
          console.error("Error cargando datos de la colección:", error);
        }
      }
    };

    cargarDatosColeccion();
  }, [coleccionSeleccionada]);

  const descargarExcel = () => {
    if (datosColeccion.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(datosColeccion);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, coleccionSeleccionada);

    XLSX.writeFile(wb, `${coleccionSeleccionada}_export.xlsx`);
    alert(`Archivo de ${coleccionSeleccionada} exportado con éxito.`);
  };

  const importarExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Por favor selecciona un archivo Excel.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!coleccionSeleccionada) {
        alert("Por favor selecciona una colección antes de importar.");
        return;
      }

      try {
        const coleccionRef = collection(db, coleccionSeleccionada);

        const batch = sheetData.map(async (row) => {
          const id = row.id || doc(coleccionRef).id; // Usa 'id' del Excel o genera uno nuevo
          const docRef = doc(db, coleccionSeleccionada, id);
          await setDoc(docRef, row);
        });

        await Promise.all(batch);

        alert("Datos importados con éxito.");
        setDatosColeccion(sheetData); // Actualiza la tabla visible
      } catch (error) {
        console.error("Error importando datos:", error);
        alert("Hubo un error al importar los datos.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const crearNuevaColeccion = async () => {
    if (!nuevaColeccion) {
      alert("Por favor, ingresa un nombre para la nueva colección.");
      return;
    }

    try {
      const nuevaRef = doc(collection(db, nuevaColeccion));
      await setDoc(nuevaRef, { ejemplo: "Datos iniciales" });
      alert(`Colección '${nuevaColeccion}' creada con éxito.`);
      setColecciones((prev) => [...prev, nuevaColeccion]); // Agregar a la lista de colecciones
      setNuevaColeccion(""); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error creando nueva colección:", error);
      alert("Hubo un error al crear la colección.");
    }
  };

  return (
    <div className="gestor-container">
      <div className="header">
        <h1>Gestor de Colecciones</h1>
        <div className="acciones-header">
          <button className="boton-descargar" onClick={descargarExcel}>
            Descargar Excel
          </button>
          <label className="boton-importar">
            Importar Excel
            <input type="file" accept=".xlsx, .xls" onChange={importarExcel} />
          </label>
        </div>
      </div>

      <div className="selector">
        <label>Seleccionar Colección:</label>
        <select
          value={coleccionSeleccionada}
          onChange={(e) => setColeccionSeleccionada(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {colecciones.map((coleccion) => (
            <option key={coleccion} value={coleccion}>
              {coleccion}
            </option>
          ))}
        </select>
      </div>

      <div className="crear-coleccion">
        <label>Nueva Colección:</label>
        <input
          type="text"
          value={nuevaColeccion}
          onChange={(e) => setNuevaColeccion(e.target.value)}
          placeholder="Nombre de la colección"
        />
        <button onClick={crearNuevaColeccion}>Crear Colección</button>
      </div>

      {coleccionSeleccionada && (
        <>
          <h2>Estructura de la Colección: {coleccionSeleccionada}</h2>
          <ul>
            {estructura.map((campo, index) => (
              <li key={index}>{campo}</li>
            ))}
          </ul>

          <h2>Datos de la Colección</h2>
          <table className="tabla-datos">
            <thead>
              <tr>
                {estructura.map((campo, index) => (
                  <th key={index}>{campo}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosColeccion.map((dato, index) => (
                <tr key={index}>
                  {estructura.map((campo, idx) => (
                    <td key={idx}>{dato[campo]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default GestorColecciones;
