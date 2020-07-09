// const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const app = express();

// set pug as view engine
app.set("view engine", "pug");
//views configuration is needed only when directory is different.
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

app.use("/admin", adminData.router);
app.use(shopRoutes);

app.use("/user", (req, res, next) => {
  console.log("Handled /user endpoint");
  res.send("<h2>Response from user endpoint</h2>");
});

app.use("/", (req, res, next) => {
  console.log("Error endpoint");
  res.status(404).render("error");
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
