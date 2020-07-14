const db = require("../../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO product (title,price,description,imageUrl) VALUES(?,?,?,?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static fetchAll() {
    // This returns a Promise object
    return db.execute("select * from product");
  }

  static findById(productId) {
    return db.execute("select * from product where id=?", [productId]);
  }

  static delete(productId) {}
};
