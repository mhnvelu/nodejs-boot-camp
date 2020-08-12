const { validationResult } = require("express-validator/check");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  if (!image) {
    let error = new Error("No image uploaded");
    error.statusCode = 422;
    throw error;
  }

  const imagePath = image.path.replace("\\", "/");

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imagePath,
    creator: "Test1",
  });

  post
    .save()
    .then((result) => {
      console.log("result", result);
      res.status(201).json({
        message: "Post created Successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        error.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Post fetched",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        error.statusCode = 500;
      }
      next(err);
    });
};
