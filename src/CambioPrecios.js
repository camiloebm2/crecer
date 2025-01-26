import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "./firebase";
import "./cambioPrecios.css";

const CambioPrecios = () => {
  const [productos, setProductos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar productos
        const productosSnapshot = await getDocs(collection(db, "productos"));
        const productosData = productosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosData);

        // Cargar compras
        const comprasSnapshot = await getDocs(collection(db, "compras"));
        const comprasData = comprasSnapshot.docs.map((doc) => doc.data());
        setCompras(comprasData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, []);

  // Obtener cantidades acumuladas de Zarzamora y Tabora desde las compras
  const obtenerCantidadPorPunto = (idProd, punto) => {
    return compras
      .filter((compra) =>
        compra.productos.some((producto) => producto.id_prod === idProd)
      )
      .reduce((total, compra) => {
        const producto = compra.productos.find(
          (producto) => producto.id_prod === idProd
        );
        return total + (producto ? parseFloat(producto[punto]) || 0 : 0);
      }, 0);
  };

  const manejarSeleccionProducto = (producto) => {
    if (productosSeleccionados.find((p) => p.id === producto.id)) {
      setProductosSeleccionados((prev) =>
        prev.filter((p) => p.id !== producto.id)
      );
    } else {
      setProductosSeleccionados((prev) => [...prev, producto]);
    }
  };

  const manejarCambioPrecio = (id, campo, valor) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === id ? { ...producto, [campo]: parseFloat(valor) || 0 } : producto
      )
    );
    setProductosSeleccionados((prev) =>
      prev.map((producto) =>
        producto.id === id ? { ...producto, [campo]: parseFloat(valor) || 0 } : producto
      )
    );
  };

  const guardarCambiosPrecios = async () => {
    try {
      const batchUpdates = productosSeleccionados.map(async (producto) => {
        const productoRef = doc(db, "productos", producto.id);
        await updateDoc(productoRef, {
          precio_zarzamora: producto.precio_zarzamora,
          precio_tabora: producto.precio_tabora,
        });
      });
      await Promise.all(batchUpdates);
      alert("Cambios de precios guardados exitosamente.");
    } catch (error) {
      console.error("Error guardando cambios de precios:", error);
      alert("Hubo un error al guardar los cambios de precios.");
    }
  };

  return (
    <div className="cambio-precios-container">
      <div className="header">
        <h2>Cambio de Precios</h2>
        <button className="guardar-cambios" onClick={guardarCambiosPrecios}>
          Guardar Cambios
        </button>
      </div>
      <div className="navegador">
        <h3>Navegador de Productos</h3>
        <div className="filtros">
          <label>Filtrar:</label>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="hoy">Con Compra Hoy</option>
            <option value="sinCompra">Sin Compra</option>
          </select>
        </div>
        <div className="navegador-scroll">
          <table className="navegador-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad Zarzamora</th>
                <th>Cantidad Tabora</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className={
                    productosSeleccionados.find((p) => p.id === producto.id)
                      ? "seleccionado"
                      : ""
                  }
                  onClick={() => manejarSeleccionProducto(producto)}
                >
                  <td>{producto.nombre_prod}</td>
                  <td>{obtenerCantidadPorPunto(producto.id, "zarzamora")}</td>
                  <td>{obtenerCantidadPorPunto(producto.id, "tabora")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="productos-main">
        <h2>Productos Seleccionados</h2>
        <table className="productos-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio Zarzamora</th>
              <th>Precio Tabora</th>
            </tr>
          </thead>
          <tbody>
            {productosSeleccionados.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre_prod}</td>
                <td>
                  <input
                    type="number"
                    value={producto.precio_zarzamora || ""}
                    onChange={(e) =>
                      manejarCambioPrecio(producto.id, "precio_zarzamora", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={producto.precio_tabora || ""}
                    onChange={(e) =>
                      manejarCambioPrecio(producto.id, "precio_tabora", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CambioPrecios;
