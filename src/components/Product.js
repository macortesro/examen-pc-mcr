import React from "react";

const Product = ({ product, addToCart }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>Precio: ${product.price}</p>
      <button onClick={() => addToCart(product)}>Agregar al carrito</button>
    </div>
  );
};

export default Product;
