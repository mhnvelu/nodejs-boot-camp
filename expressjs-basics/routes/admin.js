const express = require("express");
const router = express.Router();

router.get("/add-product", (req, res, next) => {
  res.send(
    '<form action="/admin/product" method="POST"><input type="text" name="product"><button type="submit">Submit</button> </form>'
  );
});

router.post("/product", (req, res, next) => {
  console.log("Handled /product endpoint");
  const product = req.body;
  console.log(product);
  res.redirect("/");
});

module.exports = router;
