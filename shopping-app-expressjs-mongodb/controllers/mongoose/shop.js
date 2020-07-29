const Product = require("../../models/mongoose/product");
const User = require("../../models/mongoose/user");
const Order = require("../../models/mongoose/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.getProductDetails = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: "Product Detail",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.addToCart = (req, res, next) => {
  let productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("Added to cart");
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.product")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          title: item.product.title,
          quantity: item.quantity,
          _id: item.product._id,
        };
      });

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.deleteItemFromCart = (req, res, next) => {
  let productId = req.body.productId;
  req.user
    .deleteItemFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      const ordersList = orders.map((order) => {
        const items = order.items.map((item) => {
          return { title: item.product.title, quantity: item.quantity };
        });

        return {
          _id: order._id,
          items: items,
        };
      });

      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: ordersList,
      });
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => res.redirect("/orders"))
    .catch((err) => {
      console.log("err", err);
    });
};
