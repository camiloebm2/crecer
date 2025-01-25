import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Productos from "./GestorColecciones"; // Importa el componente Productos
import Compras from "./Compras"; // Importa el componente Compras
import CambioPrecios from "./CambioPrecios"; // Importa el componente Cambio de Precios
import "./App.css"; // Archivo de estilos

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Menú de navegación */}
        <nav className="navigation">
          <Link to="/" className="nav-button">Productos</Link>
          <Link to="/compras" className="nav-button">Compras</Link>
          <Link to="/cambio-precios" className="nav-button">Cambio de Precios</Link>
        </nav>

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
  );
};

export default App;
