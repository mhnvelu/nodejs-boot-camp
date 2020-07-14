const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err && data.length > 0) {
        cart = JSON.parse(data);
      }
      let existingProductIndex = cart.products.findIndex(
        (product) => id === product.id
      );
      let existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        // cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;

      fs.writeFile(p, JSON.stringify(cart), (error) => {
        if (error) console.log("Error writing to cart", err);
      });
    });
  }

  static deleteproduct(id, productPrice) {
    fs.readFile(p, (err, data) => {
      if (!err && data.length > 0) {
        const cart = JSON.parse(data);
        const product = cart.products.find((product) => id === product.id);

        const totalPrice = cart.totalPrice - product.quantity * productPrice;
        const updatedProducts = cart.products.filter(
          (product) => id !== product.id
        );
        const updatedcart = {
          products: updatedProducts,
          totalPrice: totalPrice,
        };
        fs.writeFile(p, JSON.stringify(updatedcart), (error) => {
          if (error) console.log("Error writing to cart", err);
        });
      }
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, data) => {
      if (!err && data.length > 0) {
        const cart = JSON.parse(data);
        return cb(cart);
      }
      cb(null);
    });
  }
};
