// src/components/FileUpload.js
import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Por favor selecciona un archivo.");

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file.name}`);

    setUploading(true);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
      alert("Archivo subido exitosamente.");
    } catch (error) {
      alert("Error al subir el archivo: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Subir Archivo</h1>
      <input type="file" onChange={handleFileChange} className="form-control mb-3" />
      <button
        onClick={handleUpload}
        className="btn btn-success"
        disabled={uploading}
      >
        {uploading ? "Subiendo..." : "Subir"}
      </button>
      {downloadURL && (
        <p className="mt-3">
          Archivo disponible en: <a href={downloadURL}>{downloadURL}</a>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
