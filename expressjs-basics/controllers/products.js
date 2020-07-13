const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true,
  });
};

const postAddProduct = (req, res, next) => {
  console.log("Handled /add-product endpoint");
  new Product(req.body.title).save();
  res.redirect("/");
};

const getProducts = (req, res, next) => {
  console.log("Handled by / endpoint");
  const products = Product.fetchAll();
  res.render("shop", {
    products: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};

exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getProducts = getProducts;
