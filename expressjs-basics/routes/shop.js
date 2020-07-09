const path = require("path");
const express = require("express");
const router = express.Router();
const rootDir = require("../utils/path");
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  console.log("Handled by / endpoint");
  res.render("shop", {
    products: adminData.products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: adminData.products.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
