// reducers.js
export const compraReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD":
        return { ...state, [action.field]: action.value };
      case "RESET":
        return {
          fecha_compra: new Date().toISOString().split("T")[0],
          forma_pago: "",
          id_prov: "",
          num_factura: "",
        };
      default:
        return state;
    }
  };
  
  export const productoReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD":
        return { ...state, [action.field]: action.value };
      case "RESET":
        return {
          id_prod: "",
          cantidad_total: "",
          zarzamora: "",
          tabora: "",
          precio_compra: "",
        };
      default:
        return state;
    }
  };
  
  export const productosReducer = (state, action) => {
    switch (action.type) {
      case "ADD":
        return [...state, action.producto];
      case "REMOVE":
        return state.filter((_, index) => index !== action.index);
      case "RESET":
        return [];
      default:
        return state;
    }
  };
  