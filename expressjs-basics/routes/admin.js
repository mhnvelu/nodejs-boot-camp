const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
});

router.post("/product", (req, res, next) => {
  console.log("Handled /product endpoint");
  const product = req.body;
  console.log(product);
  res.redirect("/");
});

module.exports = router;
