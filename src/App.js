// src/App.js
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import UserForm from "./components/UserForm";
import ProductList from "./components/ProductList";

function App() {
  const [user, setUser] = useState(null);

  // Detectar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Actualiza el estado con el usuario autenticado o null si no está autenticado
    });

    return () => unsubscribe(); // Limpiar la suscripción
  }, []);

  return (
    <div>
      {!user ? (
        <UserForm /> // Mostrar el formulario si no hay sesión activa
      ) : (
        <div>
          <h2 className="text-center mt-4">Bienvenido, {user.email}</h2>
          <ProductList /> {/* Mostrar los productos si el usuario está autenticado */}
          <button
            className="btn btn-danger mt-4 mx-auto d-block"
            onClick={() => auth.signOut()} // Cerrar sesión
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
