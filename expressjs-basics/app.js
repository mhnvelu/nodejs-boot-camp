// const http = require("http");
const express = require("express");

const app = express();

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

app.use("/user", (req, res, next) => {
  console.log("Handled user endpoint");
  res.send("<h2>Response from user endpoint</h2>");
});

app.use("/", (req, res, next) => {
  console.log("Handled root endpoint");
  res.send("<h2>Response from root endpoint</h2>");
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
