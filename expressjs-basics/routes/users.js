const express = require("express");
const router = express.Router();
const users = [];

router.get("/add-user", (req, res, next) => {
  res.render("add-user", { pageTitle: "Add User", path: "/admin/add-user" });
});

router.post("/add-user", (req, res, next) => {
  users.push({ name: req.body.name });
  res.redirect("/admin/users");
});

router.get("/users", (req, res, next) => {
  res.render("users", {
    users: users,
    pageTitle: "Users",
    path: "/admin/users",
  });
});

exports.router = router;
exports.users = users;
