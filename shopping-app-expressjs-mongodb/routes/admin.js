const express = require("express");
const adminController = require("../controllers/mongoose/admin");
const { check, body } = require("express-validator/check");
const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.post(
  "/add-product",
  body("title", "Invalid Title").trim().isLength({ min: 3 }).isString(),
  body("image", "Invalid image"),
  body("price", "Invalid Price").isFloat(),
  body("description", "Invalid Description")
    .trim()
    .isLength({ min: 5, max: 400 }),
  adminController.postAddProduct
);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
  "/edit-product/",
  body("title", "Invalid Title").trim().isLength({ min: 3 }).isString(),
  body("image", "Invalid image"),
  body("price", "Invalid Price").isFloat(),
  body("description", "Invalid Description")
    .trim()
    .isLength({ min: 5, max: 400 }),
  adminController.postEditProduct
);

router.get("/products", adminController.getProducts);

router.post("/delete-product", adminController.deleteProduct);

module.exports = router;
