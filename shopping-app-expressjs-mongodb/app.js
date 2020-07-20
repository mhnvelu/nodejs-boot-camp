const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

// const errorController = require("./controllers/error");
const { mongoConnect } = require("./util/database");

// const Product = require("./models/db/product");
const User = require("./models/user");
// const Cart = require("./models/db/cart");
// const CartItem = require("./models/db/cartItem");
// const Order = require("./models/db/order");
// const OrderItem = require("./models/db/orderItem");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByName("test")
    .then((user) => {
      if (user) {
        req.user = new User(user.username, user.email, user._id, user.cart);
      } else {
        const userData = new User("test", "test@gmail.com");
        return userData.save();
      }
    })
    .then((user) => {
      User.findByName("test").then(
        (user) =>
          (req.user = new User(user.username, user.email, user._id, user.cart))
      );
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
