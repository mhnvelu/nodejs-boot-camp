const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (args, req) => {
    const email = args.userInput.email;
    const name = args.userInput.name;
    const password = args.userInput.password;

    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "Email is invalid" });
    }
    if (validator.isEmpty(name)) {
      errors.push({ message: "Name is invalid" });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password too short" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    let user = new User({
      email: email,
      name: name,
      password: hashedPassword,
    });

    const createdUser = await user.save();
    console.log("user : ", createdUser);
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found!");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      "supersecret",
      { expiresIn: "1h" }
    );

    return { token: token, userId: user._id.toString() };
  },

  createPost: async ({ postInput }, req) => {
    if (!req.isAuth) {
      const error = new Error("User not authenticated");
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (validator.isEmpty(postInput.title)) {
      errors.push({ message: "Title is invalid" });
    }
    if (validator.isEmpty(postInput.content)) {
      errors.push({ message: "Content is invalid" });
    }
    if (validator.isEmpty(postInput.imageUrl)) {
      errors.push({ message: "Image not uploaded" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid Use");
      error.code = 401;
      throw error;
    }

    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: "someurl",
      creator: user,
    });

    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },

  getPosts: async (args, req) => {
    if (!req.isAuth) {
      const error = new Error("User not authenticated");
      error.code = 401;
      throw error;
    }
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find().sort({ createdAt: -1 }).populate("creator");

    //graphql doesnt understand _id, date from post. so we need to convert them into string
    return {
      posts: posts.map((post) => {
        return {
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },
};
