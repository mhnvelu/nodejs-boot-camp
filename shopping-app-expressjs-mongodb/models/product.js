const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    if (this._id) {
      return getDb()
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this })
        .then((result) => {
          // console.log("RESULT : ", result);
        })
        .catch((err) => console.log(err));
    } else {
      return getDb()
        .collection("products")
        .insertOne(this)
        .then((result) => {
          // console.log("RESULT : ", result);
        })
        .catch((err) => console.log(err));
    }
  }

  static fetchAll() {
    //find returns cursor
    return getDb()
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        // console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(id) {
    return getDb()
      .collection("products")
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then((product) => {
        // console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(id) {
    return getDb()
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => console.log("RESULT : ", result))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
