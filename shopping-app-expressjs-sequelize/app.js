const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const sequelize = require("./util/database");
const Product = require("./models/db/product");
const User = require("./models/db/user");
const Cart = require("./models/db/cart");
const CartItem = require("./models/db/cartItem");
const Order = require("./models/db/order");
const OrderItem = require("./models/db/orderItem");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/db/admin");
const shopRoutes = require("./routes/db/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      // The user returned from DB is not just JS object. Its Sequelize object. It contains Sequelize specific methods.
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Create Associations between tables
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

//one-to-one
User.hasOne(Cart);
Cart.belongsTo(User);

//many-to-many
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

//user-order-product associations
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// creates Tables for all the models defined if not present.
sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "testuser", email: "testuser@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    user
      .getCart({ where: { userId: user.id } })
      .then((cart) => {
        if (!cart) {
          return user.createCart();
        }
        return cart;
      })
      .catch((err) => console.log("err", err));
  })
  .then((cart) => app.listen(3000))
  .catch((err) => console.log("err", err));
