import React, { useReducer } from "react";
import FechaSelector from "./components/FechaSelector";
import Proveedor from "./components/Proveedor";
import Producto from "./components/Producto";
import InputNumerico from "./components/InputNumerico";
import DynamicQuantityInput from "./components/DynamicQuantityInput";
import TablaProductos from "./components/TablaProductos";
import "./compras.css";

// Estado inicial
const initialState = {
  compra: {
    fecha: new Date().toISOString().split("T")[0],
    proveedor: null,
    producto: null,
    cantidadTotal: 0,
    zarzamora: 0,
    tabora: 0,
    precioCompra: 0,
    numFactura: "",
    formaPago: "",
  },
  productosLista: [],
  error: "",
};

// Reducer
const comprasReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        compra: { ...state.compra, [action.payload.field]: action.payload.value },
      };
    case "ADD_PRODUCT":
      if (!state.compra.producto || state.compra.cantidadTotal <= 0) {
        return { ...state, error: "Debe seleccionar un producto y agregar una cantidad válida." };
      }
      return {
        ...state,
        productosLista: [
          ...state.productosLista,
          {
            producto: state.compra.producto,
            cantidadTotal: state.compra.cantidadTotal,
            zarzamora: state.compra.zarzamora,
            tabora: state.compra.tabora,
            precioCompra: state.compra.precioCompra,
          },
        ],
        compra: { ...initialState.compra, fecha: state.compra.fecha },
        error: "",
      };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        productosLista: state.productosLista.filter((_, index) => index !== action.payload),
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const Compras = () => {
  const [state, dispatch] = useReducer(comprasReducer, initialState);

  // Manejador genérico para actualizar cualquier campo
  const handleFieldChange = (field, value) => {
    dispatch({ type: "SET_FIELD", payload: { field, value } });
  };

  const agregarProducto = () => {
    dispatch({ type: "ADD_PRODUCT" });
  };

  const registrarCompra = () => {
    if (state.productosLista.length === 0) {
      dispatch({ type: "SET_ERROR", payload: "Debe agregar al menos un producto." });
      return;
    }

    const compraFinal = {
      ...state.compra,
      productos: state.productosLista,
    };

    console.log("Compra registrada:", compraFinal);
    alert("Compra registrada exitosamente.");
    dispatch({ type: "RESET" });
  };

  return (
    <div className="compras-container">
      <h1>Registro de Compras</h1>

      {/* Mensaje de error */}
      {state.error && <div className="error-message">{state.error}</div>}

      {/* Fecha de Compra */}
      <FechaSelector
        value={state.compra.fecha}
        onFechaChange={(fecha) => handleFieldChange("fecha", fecha)}
      />

      <div className="form-row">
        {/* Proveedor */}
        <Proveedor
          onProveedorSelect={(proveedor) => handleFieldChange("proveedor", proveedor)}
        />

        {/* Forma de Pago */}
        <div className="form-field">
          <label>Forma de Pago:</label>
          <select
            name="formaPago"
            value={state.compra.formaPago}
            onChange={(e) => handleFieldChange("formaPago", e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="Contado">Contado</option>
            <option value="Crédito">Crédito</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        {/* Número de Factura */}
        <div className="form-field">
          <label>Número de Factura:</label>
          <input
            type="text"
            name="numFactura"
            value={state.compra.numFactura}
            onChange={(e) => handleFieldChange("numFactura", e.target.value)}
          />
        </div>

        {/* Producto */}
        <Producto
          onProductoSelect={(producto) => handleFieldChange("producto", producto)}
        />
      </div>

      {/* Cantidad Total */}
      <InputNumerico
        label="Cantidad Total"
        value={state.compra.cantidadTotal}
        onChange={(value) => handleFieldChange("cantidadTotal", value)}
        placeholder="Ingrese cantidad"
      />

      {/* Zarzamora y Tabora */}
      <DynamicQuantityInput
        totalQuantity={state.compra.cantidadTotal}
        zarzamora={state.compra.zarzamora}
        tabora={state.compra.tabora}
        onChange={({ zarzamora, tabora }) => {
          handleFieldChange("zarzamora", zarzamora);
          handleFieldChange("tabora", tabora);
        }}
      />

      {/* Precio de Compra */}
      <InputNumerico
        label="Precio de Compra"
        value={state.compra.precioCompra}
        onChange={(value) => handleFieldChange("precioCompra", value)}
        placeholder="Ingrese precio"
      />

      {/* Lista de Productos */}
      <TablaProductos
        columnas={[
          { titulo: "Producto", campo: "producto" },
          { titulo: "Cantidad Total", campo: "cantidadTotal" },
          { titulo: "Zarzamora", campo: "zarzamora" },
          { titulo: "Tabora", campo: "tabora" },
          { titulo: "Precio Compra", campo: "precioCompra" },
        ]}
        datos={state.productosLista}
        acciones={[
          {
            texto: "Eliminar",
            clase: "btn-eliminar",
            onClick: (_, index) => dispatch({ type: "REMOVE_PRODUCT", payload: index }),
          },
        ]}
      />

      {/* Botones */}
      <div className="buttons">
        <button className="btn-add" onClick={agregarProducto}>
          Agregar Producto
        </button>
        <button className="btn-register" onClick={registrarCompra}>
          Registrar Compra
        </button>
      </div>
    </div>
  );
};

export default Compras;
