const express = require("express");

const shopController = require("../../controllers/db/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:id", shopController.getProductDetails);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.addToCart);

router.post("/cart-delete-item", shopController.deleteItemFromCart);

router.get("/orders", shopController.getOrders);

router.post("/create-order", shopController.postOrder);

module.exports = router;
