const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Order = require("./order");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiry: String,
  cart: {
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  let newQuantity = 1;
  if (this.cart) {
    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.product.toString() === product._id.toString()
    );
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        product: product._id,
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };

    this.cart = updatedCart;
    this.save();
  } else {
    const updatedCart = {
      items: [
        {
          product: product._id,
          quantity: newQuantity,
        },
      ],
    };
    this.cart = updatedCart;
    this.save();
  }
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.addOrder = function () {
  return this.populate("cart.items.product")
    .execPopulate()
    .then((user) => {
      const products = this.cart.items.map((item) => {
        return { product: { ...item.product._doc }, quantity: item.quantity };
      });
      const order = new Order({
        user: {
          email: this.email,
          userId: this,
        },
        items: products,
      });
      return order.save();
    })
    .then((result) => {
      this.cart = { items: [] };
      return this.save();
    })
    .catch();
};

module.exports = mongoose.model("User", userSchema);
