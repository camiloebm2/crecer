import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Productos from "./Productos"; // Importa el componente React
import Compras from "./Compras"; // Importa el componente Compras

const App = () => {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            {/* Ruta principal para el componente Productos */}
            <Route path="/" element={<Productos />} />
             {/* Ruta para el componente Compras */}
            <Route path="/compras" element={<Compras />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
