const express = require("express");
const { body } = require("express-validator/check");
const feedController = require("../controllers/feed");

const router = express.Router();

router.get("/posts", feedController.getPosts);

router.post(
  "/post",
  body("title", "Invalid Title").trim().isLength({ min: 5 }).isString(),
  body("image", "Invalid image"),
  body("content", "Invalid Content")
    .trim()
    .isLength({ min: 5, max: 400 })
    .isString(),
  feedController.createPost
);

router.get("/post/:postId", feedController.getPost);

module.exports = router;
