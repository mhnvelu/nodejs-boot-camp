const path = require("path");

const express = require("express");

const shopController = require("../controllers/mongoose/shop");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:id", shopController.getProductDetails);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.addToCart);

router.post("/cart-delete-item", isAuth, shopController.deleteItemFromCart);

router.get("/orders", isAuth, shopController.getOrders);

// router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders/:orderId", isAuth, shopController.getOrderInvoice);

router.get("/checkout", isAuth, shopController.getCheckout);

router.get("/checkout/success", shopController.getCheckoutSuccess);

router.get("/checkout/cancel", shopController.getCheckout);

module.exports = router;
