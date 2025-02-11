import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppProvider } from "./AppContext";
import Productos from "./GestorColecciones";
import Compras from "./Compras";
import CambioPrecios from "./CambioPrecios";
import "./App.css";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          {/* Encabezado con navegación estilizada */}
          <header className="header">
            <Link to="/">Gestor Base de Datos</Link>
            <Link to="/compras">Compras</Link>
            <Link to="/cambio-precios">Cambio de Precios</Link>
          </header>

          {/* Contenido de las rutas */}
          <div className="content">
            <Routes>
              <Route path="/" element={<Productos />} />
              <Route path="/compras" element={<Compras />} />
              <Route path="/cambio-precios" element={<CambioPrecios />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
