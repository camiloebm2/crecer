import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Productos from "./Productos"; // Importa el componente React

const App = () => {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            {/* Ruta principal para el componente Productos */}
            <Route path="/" element={<Productos />} />

            {/* Puedes agregar otras rutas aquí si es necesario */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
