const Product = require("../../models/db/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log("err", err));
};

exports.getEditProduct = (req, res, next) => {
  let editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  let productId = req.params.productId;

  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log("err", err));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then((result) => res.redirect("/admin/products"))
    .catch((err) => console.log("err", err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.deleteProduct = (req, res, next) => {
  let productId = req.body.productId;
  Product.destroy({ where: { id: productId } })
    .then((result) => res.redirect("/admin/products"))
    .catch((err) => {
      console.log("err", err);
    });
};
