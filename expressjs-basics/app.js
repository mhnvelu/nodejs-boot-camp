// const http = require("http");
const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("In Middleware 1");
  next();
});

app.use((req, res, next) => {
  console.log("In Middleware 2");
  //   res.send("<h2>Response from Middleware 2</h2>");
  res.send("Response from Middleware 2");
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
