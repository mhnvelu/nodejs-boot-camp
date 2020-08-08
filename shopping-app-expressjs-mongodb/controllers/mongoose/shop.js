const fs = require('fs');
const path = require('path');
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => res.redirect("/orders"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrderInvoice = (req,res,next) => {
  const orderId = req.params.orderId;

Order.findById(orderId).then(order => {
   if(!order){
    return next(new Error("Order not found!"));
  }
  if(order.user.userId.toString() !== req.user._id.toString()){
    return next(new Error("Unauthorized!"));
  }
  const invoiceName = 'Invoice-'+orderId+'.pdf';
  const invoicePath = path.join('data','invoices',invoiceName);

  //Option 1 : Whole file is read into memory and served.
  // fs.readFile(invoicePath,(err,data) => {
  //   if(err) {
  //  return  next(err);
  //   }
  //   res.setHeader('Content-Type','application/pdf');
  //   res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
  //   // res.setHeader('Content-Disposition','attachment; filename="'+invoiceName+'"');
  //   res.send(data);  
  // });

    //Option 2 : File is read in chunks and served.
    const file = fs.createReadStream(invoicePath);
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    file.pipe(res);
}).catch(err => next(err))
}
