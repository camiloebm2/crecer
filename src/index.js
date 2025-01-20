import React from 'react';
import ReactDOM from 'react-dom/client';  // Usa 'react-dom/client' en lugar de 'react-dom'
//import './App.css';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);