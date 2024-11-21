import React, { useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const UserForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [validator] = useState(new SimpleReactValidator());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validator.allValid()) {
      validator.showMessages();
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Usuario registrado exitosamente.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Inicio de sesión exitoso.");
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center">{isRegistering ? "Registro" : "Inicio de Sesión"}</h1>
          <form onSubmit={handleSubmit} className="border p-4 shadow-sm rounded">
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validator.showMessageFor("email")}
              />
              {validator.message("email", email, "required|email")}
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validator.showMessageFor("password")}
              />
              {validator.message("password", password, "required|min:6")}
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary w-100">
              {isRegistering ? "Registrarse" : "Iniciar Sesión"}
            </button>
          </form>
          <button
            className="btn btn-link mt-3"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "¿Ya tienes una cuenta? Inicia Sesión" : "Crear una cuenta nueva"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
