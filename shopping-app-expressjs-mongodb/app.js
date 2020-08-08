const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const multer = require("multer");
// const { mongoConnect } = require("./util/database");

// const User = require("./models/user");
const User = require("./models/mongoose/user");
const isAuth = require("./middleware/isAuth");
const csrf = require("csurf");
const connectFlash = require("connect-flash");

const app = express();
const sessionStore = new MongoDBStore({
  uri: `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DB}?retryWrites=true&w=majority`,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/mongoose/error");

app.use(bodyParser.urlencoded({ extended: false }));

//multi-part data - multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage : fileStorage, fileFilter : fileFilter }).single("image"));

//By default, Serves the files from this directory but as if files are in root directory /
app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));
// app.use(cookieParser());
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// add csrf protection after session middleware bz csurf uses it
const csrfProtection = csrf();
app.use(csrfProtection);
app.use(connectFlash());

// Adding csrf token to all pages.
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.loggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", isAuth, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

//Error Handling Middleware
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Internal Server Error",
    path: "/500",
    isAuthenticated: req.session.loggedIn,
  });
});

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
