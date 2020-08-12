const { validationResult } = require("express-validator/check");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");
const user = require("../models/user");

exports.getPosts = (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const POSTS_PER_PAGE = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      const POSTS_PER_PAGE = 2;
      return Post.find()
        .skip((currentPage - 1) * POSTS_PER_PAGE)
        .limit(POSTS_PER_PAGE);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts,
        totalItems: totalItems,
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
    creator: req.userId,
  });

  let creator;
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) =>
      res.status(201).json({
        message: "Post created Successfully",
        post: post,
        creator: { _id: creator._id, name: creator.name },
      })
    )
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

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  const image = req.file;
  if (image) {
    imageUrl = image.path.replace("\\", "/");
  }
  if (!imageUrl) {
    let error = new Error("No image uploaded");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized");
        error.statusCode = 403;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        deleteImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post updated successfully",
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

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized");
        error.statusCode = 403;
        throw error;
      }

      deleteImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      console.log(result);
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post deleted successfully",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deleteImage = (imagePath) => {
  imagePath = path.join(__dirname, "..", imagePath);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
