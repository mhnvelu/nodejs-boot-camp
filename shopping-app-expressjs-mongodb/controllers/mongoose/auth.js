const User = require("../../models/mongoose/user");
exports.getLogin = (req, res, next) => {
  console.log(req.session.loggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-Cookie", "loggedIn=true");
  req.session.loggedIn = true;
  User.findOne({ username: "test" })
    .then((user) => {
      if (user) {
        req.session.user = user;
      } else {
        const userData = new User({
          username: "test",
          email: "test@gmail.com",
          cart: { items: [] },
        });
        return userData.save();
      }
    })
    .then((user) => {
      User.findOne({ username: "test" }).then(
        (user) => (req.session.user = user)
      );
    })
    .catch((err) => console.log("err", err));
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
