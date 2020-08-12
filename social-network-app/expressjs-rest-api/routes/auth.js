const express = require("express");
const { body } = require("express-validator/check");
const User = require("../models/user");
const authController = require("../controllers/auth");
const router = express.Router();

router.put(
  "/signup",
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter valid Email")
    .custom((value, { req }) => {
      return User.findOne({ email: value })
        .then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        })
        .catch((err) => console.log(err));
    }),
  body("name").trim().isAlpha().notEmpty().withMessage("Invalid Name"),
  body("password").trim().isLength({ min: 5 }).withMessage("Invalid Password"),
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
