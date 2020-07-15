const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const sequelize = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/db/admin");
const shopRoutes = require("./routes/db/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// creates Tables for all the models defined if not present.
sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => console.log("err", err));
