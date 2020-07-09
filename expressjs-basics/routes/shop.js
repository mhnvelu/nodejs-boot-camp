const path = require("path");
const express = require("express");
const router = express.Router();
const rootDir = require("../utils/path");

router.get("/", (req, res, next) => {
  console.log("Handled by / endpoint");
  res.render("shop");
});

module.exports = router;
