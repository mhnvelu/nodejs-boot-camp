const express = require("express");
const { route } = require("./admin");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("Handled root endpoint");
  const product = req.body;
  console.log(product);
  res.send("<h2>Response from root endpoint</h2>");
});

module.exports = router;
