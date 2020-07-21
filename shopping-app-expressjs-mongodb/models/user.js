const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class User {
  constructor(username, email, userId, cart) {
    this.username = username;
    this.email = email;
    this.userId = userId;
    this.cart = cart; // { items : []}
  }

  save() {
    return getDb().collection("users").insertOne(this);
  }

  addToCart(product) {
    let newQuantity = 1;
    if (this.cart) {
      const cartProductIndex = this.cart.items.findIndex(
        (cp) => cp.productId.toString() === product._id.toString()
      );
      const updatedCartItems = [...this.cart.items];
      if (cartProductIndex >= 0) {
        newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: new mongodb.ObjectId(product._id),
          quantity: newQuantity,
        });
      }
      const updatedCart = {
        items: updatedCartItems,
      };

      return getDb()
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this.userId) },
          { $set: { cart: updatedCart } }
        );
    } else {
      const updatedCart = {
        items: [
          {
            productId: new mongodb.ObjectId(product._id),
            quantity: newQuantity,
          },
        ],
      };
      return getDb()
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this.userId) },
          { $set: { cart: updatedCart } }
        );
    }
  }

  static findByName(username) {
    return getDb().collection("users").findOne({ username: username });
  }

  getCart() {
    const productIds = this.cart.items.map((product) => product.productId);
    return getDb()
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => {
              return item.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      })
      .catch();
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    const updatedCart = {
      items: updatedCartItems,
    };
    return getDb()
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this.userId) },
        { $set: { cart: updatedCart } }
      );
  }

  addOrder() {
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this.userId),
            name: this.username,
          },
        };
        return getDb().collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return getDb()
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this.userId) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    return getDb()
      .collection("orders")
      .find({ "user.name": this.username })
      .toArray();
  }
}

module.exports = User;
