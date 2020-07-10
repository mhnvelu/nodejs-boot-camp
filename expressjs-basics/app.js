// const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const usersData = require("./routes/users");
const app = express();

// Template engine - handlebar
// Handlebar expects main.handlebars in /views/layouts/ dir
// const expressHbs = require("express-handlebars");
// app.engine("hbs", expressHbs());
// app.set("view engine", "hbs");
// hbs will be the file extension for other html files. we can use any name.

// set pug as view engine
// app.set("view engine", "pug");
//views configuration is needed only when directory is different.

// set ejs as view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

// Middleware from express allows to provide read access to css files
// This is not handled by routes.
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("-----------------------");
  console.log("In Middleware 1");
  next();
  // res.send("Response from Middleware 1");
});

app.use((req, res, next) => {
  console.log("In Middleware 2");
  next();
  //   res.send("<h2>Response from Middleware 2</h2>");
});

app.use("/admin", adminData.router, usersData.router);
app.use(shopRoutes);
// app.use("/admin", usersData.router);

app.use("/", (req, res, next) => {
  console.log("Error endpoint");
  res.status(404).render("error", { pageTitle: "Error" });
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
