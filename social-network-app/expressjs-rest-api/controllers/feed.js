const { validationResult } = require("express-validator/check");
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First post",
        content: "This is first post",
        imageUrl: "images/book.jpg",
        creator: {
          name: "Test1",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: "Validation failed, entered data is incorrect",
        errors: errors.array(),
      });
  }

  res.status(201).json({
    message: "post created",
    post: {
      _id: new Date(),
      title: title,
      content: content,
      creator: {
        name: "Test1",
      },
      createdAt: new Date(),
    },
  });
};
