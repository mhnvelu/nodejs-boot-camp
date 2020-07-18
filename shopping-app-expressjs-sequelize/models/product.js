const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err || fileContent.length == 0) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        let existingProductIndex = products.findIndex(
          (product) => this.id === product.id
        );
        products[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) console.log(err);
        });
      } else {
        this.id = uuidv4();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(productId, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => productId === product.id);
      cb(product);
    });
  }

  static delete(productId) {
    getProductsFromFile((products) => {
      let product = products.find((product) => productId === product.id);
      let newProducts = products.filter((product) => productId !== product.id);
      fs.writeFile(p, JSON.stringify(newProducts), (err) => {
        if (!err) Cart.deleteproduct(productId, product.price);
      });
    });
  }
};
