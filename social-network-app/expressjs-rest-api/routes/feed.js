const express = require("express");
const { body } = require("express-validator/check");
const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  body("title", "Invalid Title").trim().isLength({ min: 5 }).isString(),
  body("content", "Invalid Content")
    .trim()
    .isLength({ min: 5, max: 400 })
    .isString(),
  feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.put(
  "/post/:postId",
  body("title", "Invalid Title").trim().isLength({ min: 5 }).isString(),
  body("content", "Invalid Content")
    .trim()
    .isLength({ min: 5, max: 400 })
    .isString(),
  feedController.updatePost
);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
