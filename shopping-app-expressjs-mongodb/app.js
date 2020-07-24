const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// const { mongoConnect } = require("./util/database");

// const User = require("./models/user");
const User = require("./models/mongoose/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use((req, res, next) => {
  User.findOne({ username: "test" })
    .then((user) => {
      if (user) {
        req.user = user;
      } else {
        const userData = new User({
          username: "test",
          email: "test@gmail.com",
          cart: { items: [] },
        });
        return userData.save();
      }
    })
    .then((user) => {
      User.findOne({ username: "test" }).then((user) => (req.user = user));
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//using mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    console.log("Connected to DB");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

//using mongodb driver
// mongoConnect(() => {
//   app.listen(3000);
// });
