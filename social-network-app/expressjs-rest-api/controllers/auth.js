const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created successfully",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        let error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        let error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "somesecret",
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.signout = (req, res, next) => {};

exports.getUserStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        let error = new Error("user not found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        status: user.status,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUserStatus = (req, res, next) => {
  const newStatus = req.body.status;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        let error = new Error("user not found!");
        error.statusCode = 404;
        throw error;
      }
      user.status = newStatus;
      return user.save();
    })
    .then((user) => {
      res.status(200).json({
        message: "User status updated",
        status: user.status,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
