// src/components/ProductList.js
import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const ProductList = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Plátano",
      price: 100,
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    },
    {
      id: 2,
      name: "Manzana",
      price: 200,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    },
    {
      id: 3,
      name: "Pera",
      price: 300,
      image: "https://juanesparraguito.com/cdn/shop/files/FotosWeb_parte1_Mesadetrabajo1copia77.jpg?v=1710855795&width=1214",
    },
  ]);

  const [cart, setCart] = useState({});
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  // Cargar lista de compras desde Firestore al iniciar sesión
  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      if (user) {
        const cartRef = doc(db, "carts", user.uid);
        const cartSnapshot = await getDoc(cartRef);

        if (cartSnapshot.exists()) {
          setCart(cartSnapshot.data().items || {});
        }
      }
    };

    fetchCart();
  }, []);

  const saveCartToFirestore = async (updatedCart) => {
    const user = auth.currentUser;
    if (user) {
      const cartRef = doc(db, "carts", user.uid);
      await setDoc(cartRef, { items: updatedCart }, { merge: true });
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[product.id]) {
        newCart[product.id].quantity += 1;
      } else {
        newCart[product.id] = { ...product, quantity: 1 };
      }
      saveCartToFirestore(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId].quantity -= 1;
        if (newCart[productId].quantity === 0) {
          delete newCart[productId];
        }
      }
      saveCartToFirestore(newCart);
      return newCart;
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Por favor selecciona un archivo.");

    const storage = getStorage();
    const storageRef = ref(storage, `payments/${file.name}`);

    setUploading(true);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setDownloadURL(url);
      alert("Imagen subida exitosamente.");
    } catch (error) {
      alert("Error al subir la imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Lista de Frutas</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4">
            <div className="card mb-4 shadow-sm">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Precio: ${product.price}</p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => addToCart(product)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mostrar productos en el carrito */}
      <h2 className="mt-5">Carrito</h2>
      <ul className="list-group">
        {Object.values(cart).length === 0 ? (
          <li className="list-group-item text-center">El carrito está vacío</li>
        ) : (
          Object.values(cart).map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {item.name} <span className="text-muted">(${item.price})</span>
              </div>
              <div>
                <span className="badge bg-primary rounded-pill me-3">{item.quantity}</span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Subir imagen de transferencia de pago */}
      <div className="mt-5">
        <h3>Subir imagen de transferencia de pago</h3>
        <input
          type="file"
          className="form-control mb-3"
          onChange={handleFileChange}
        />
        <button
          className="btn btn-success"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Subir"}
        </button>
        {downloadURL && (
          <p className="mt-3">
            Imagen disponible en: <a href={downloadURL}>{downloadURL}</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
