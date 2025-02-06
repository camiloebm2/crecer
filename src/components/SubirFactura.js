import React from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../firebase";
import "./SubirFactura.css";

const SubirFactura = ({ productosLista, setProductosLista, setCompra }) => {
  const handleSubirFactura = async () => {
    if (productosLista.length === 0) {
      alert("No hay productos en la factura para subir.");
      return;
    }

    try {
      const fechaActual = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
      console.log("Fecha de compra a actualizar:", fechaActual);

      for (const producto of productosLista) {
        console.log("Procesando producto:", producto);

        // Convertir id_prod a número si es posible, sino mantenerlo como string
        const idProdStr = String(producto.id_prod || "").trim();
        const idProdNum = Number(producto.id_prod) || null;

        if (!idProdStr) {
          console.warn("⛔ Producto ignorado por falta de id_prod:", producto);
          continue;
        }

        // Buscar el documento en Firestore por el campo `id_prod` (tanto como string y número)
        const productosRef = collection(db, "productos");
        let q = query(productosRef, where("id_prod", "==", idProdStr));

        let querySnapshot = await getDocs(q);

        if (querySnapshot.empty && idProdNum !== null) {
          // Intentar buscar como número si no se encuentra como string
          q = query(productosRef, where("id_prod", "==", idProdNum));
          querySnapshot = await getDocs(q);
        }

        if (querySnapshot.empty) {
          console.error(`⛔ No se encontró el producto con id_prod: ${producto.id_prod}`);
          continue;
        }

        // Obtener el ID real del documento en Firestore
        const docId = querySnapshot.docs[0].id;
        const productoRef = doc(db, "productos", docId);

        // Datos a actualizar en Firestore
        const updateData = {
          fecha_compra: fechaActual,
          cant_tab: Number(producto.tabora) || 0,
          cant_zarza: Number(producto.zarzamora) || 0,
          precio_compra: Number(producto.precioCompra) || 0,
          presentacion: producto.presentacion || "No especificada", // 🔹 Se asegura que la presentación se actualice correctamente
        };

        console.log(`✅ Actualizando producto ${docId} con datos:`, updateData);
        await updateDoc(productoRef, updateData);
        console.log(`✅ Producto ${docId} actualizado correctamente en Firestore.`);
      }

      // Limpiar formulario después de subir la factura
      setProductosLista([]);
      setCompra({
        fecha: new Date().toISOString().split("T")[0],
        proveedor: "",
        proveedorId: "",
        numFactura: "",
        tipoPago: "debito", // Se mantiene la opción de pago
        producto: "",
        presentacion: "",
        cantidadTotal: 0,
        zarzamora: 0,
        tabora: 0,
        precioCompra: 0,
        id_prod: "",
      });

      alert("Factura subida y base de datos actualizada con éxito.");
    } catch (error) {
      console.error("❌ Error al subir la factura:", error);
      alert(`Hubo un error al subir la factura: ${error.message}`);
    }
  };

  return (
    <button className="btn-subir-factura" onClick={handleSubirFactura}>
      Subir Factura
    </button>
  );
};

export default SubirFactura;
