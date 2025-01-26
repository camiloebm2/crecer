// utils.js

// Valida que los datos de la compra estén completos
export const validateCompra = (compra, productosLista) => {
  if (!compra.fecha_compra || !compra.forma_pago || !compra.id_prov || !compra.num_factura) {
    return "Por favor complete todos los campos de la compra.";
  }
  if (productosLista.length === 0) {
    return "Debe agregar al menos un producto.";
  }
  return null;
};

// Valida que un número sea positivo (incluyendo cero)
export const validatePositiveNumber = (value) => {
  const number = parseFloat(value);
  return !isNaN(number) && number >= 0;
};

// Formatea un número para mostrarlo con un máximo de 2 decimales
export const formatNumber = (value) => {
  const number = parseFloat(value);
  return !isNaN(number) ? number.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : "0.00";
};

// Valida que una cadena no esté vacía
export const validateNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

// Función para cargar una colección desde Firebase
export const fetchCollection = async (db, collectionName) => {
  try {
    const { collection, getDocs } = await import("firebase/firestore");
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error al cargar la colección ${collectionName}:`, error);
    throw error;
  }
};

export default {
  validateCompra,
  validatePositiveNumber,
  formatNumber,
  validateNonEmptyString,
  fetchCollection,
};
