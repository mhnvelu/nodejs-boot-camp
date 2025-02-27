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

  // Any of the below options can be used.

  // Option 1 : The sequelize object user contains createproduct method bz of association.
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    // Option 2: Set userId: req.user.id,
    // Product.create({
    //   title: title,
    //   price: price,
    //   imageUrl: imageUrl,
    //   description: description,
    //   userId: req.user.id,
    // })
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

  req.user
    .getProducts({ where: { id: productId } })

    // Product.findByPk(productId, { where: { userId: req.user.id } })
    .then((products) => {
      let product = products[0];
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
  req.user
    .getProducts()
    // Product.findAll()
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
  Product.destroy({ where: { id: productId, userId: req.user.id } })
    .then((result) => res.redirect("/admin/products"))
    .catch((err) => {
      console.log("err", err);
    });
};
