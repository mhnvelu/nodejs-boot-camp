const express = require("express");
const router = express.Router();
const authController = require("../controllers/mongoose/auth");
const { check, body } = require("express-validator/check");
const User = require("../models/mongoose/user");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body(
    "password",
    "Please enter a password with only alphabets, numbers and atleast 5 characters"
  )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

//check - it will look for passed attribute in body, params and cookies.
// body - it will look for passed attribute in body
router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom((value, { req }) => {
      // Adding Async Validation.
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      });
    }),
  body(
    "password",
    "Please enter a password with only alphabets, numbers and atleast 5 characters"
  )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  authController.postSignup
);

router.get("/reset", authController.getResetPassword);

router.post("/reset", authController.postResetPassword);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
