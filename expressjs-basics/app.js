// const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

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

app.use(adminRoutes);
app.use(shopRoutes);

app.use("/user", (req, res, next) => {
  console.log("Handled /user endpoint");
  res.send("<h2>Response from user endpoint</h2>");
});

app.use("/", (req, res, next) => {
  console.log("Error endpoint");
  res.status(404).send("<h2>Page not found !!!</h2>");
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
