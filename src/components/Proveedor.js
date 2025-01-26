import React, { useState, useEffect, useRef } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./Proveedor.css"; // Estilo específico para el componente Proveedor

const Proveedor = ({ onProveedorSelect }) => {
  const [proveedores, setProveedores] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [buscarProveedor, setBuscarProveedor] = useState("");
  const refProveedor = useRef(null); // Referencia para detectar clics fuera del componente

  // Cargar proveedores desde Firebase
  const cargarProveedores = async () => {
    const db = getFirestore();
    const proveedoresRef = collection(db, "proveedores");

    try {
      const snapshot = await getDocs(proveedoresRef);
      const proveedoresCargados = snapshot.docs.map((doc) => ({
        id: doc.id, // ID único del documento
        ...doc.data(), // Datos del proveedor
      }));
      setProveedores(proveedoresCargados);
    } catch (error) {
      console.error("Error al cargar proveedores desde Firebase:", error);
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  // Manejar la selección de un proveedor
  const manejarSeleccion = (proveedor) => {
    onProveedorSelect(proveedor); // Devuelve el proveedor seleccionado al componente padre
    setBuscarProveedor(proveedor.nombre_prov); // Muestra el nombre del proveedor seleccionado
    setMostrarDropdown(false); // Oculta el desplegable
  };

  // Cerrar el desplegable si haces clic fuera del componente
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (refProveedor.current && !refProveedor.current.contains(event.target)) {
        setMostrarDropdown(false); // Cierra el desplegable si se hace clic fuera
      }
    };

    document.addEventListener("mousedown", manejarClickFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, []);

  // Filtrar proveedores según el texto ingresado
  const proveedoresFiltrados = proveedores.filter((prov) =>
    prov.nombre_prov.toLowerCase().includes(buscarProveedor.toLowerCase())
  );

  return (
    <div className="proveedor-container" ref={refProveedor}>
      <label>
        Proveedor:
        <input
          type="text"
          value={buscarProveedor}
          onChange={(e) => {
            setBuscarProveedor(e.target.value);
            setMostrarDropdown(true);
          }}
          placeholder="Buscar proveedor"
          onFocus={() => setMostrarDropdown(true)}
        />
      </label>

      {/* Mostrar el desplegable o un mensaje de error */}
      {mostrarDropdown && proveedoresFiltrados.length > 0 && (
        <ul className="desplegable">
          {proveedoresFiltrados.map((prov) => (
            <li key={prov.id} onMouseDown={() => manejarSeleccion(prov)}>
              {prov.nombre_prov}
            </li>
          ))}
        </ul>
      )}

      {mostrarDropdown && proveedoresFiltrados.length === 0 && (
        <p>No se encontraron proveedores.</p>
      )}
    </div>
  );
};

export default Proveedor;
