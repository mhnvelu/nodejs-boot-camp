const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");

const app = express();
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));

//middle ware to handle CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not Authenticated");
  }

  if (!req.file) {
    return res.status(200).json("No image uploaded");
  }

  if (req.body.oldPath) {
    deleteImage(req.body.oldPath);
  }

  const filePath = req.file.path.replace("\\", "/");

  return res.status(201).json({
    message: "File stored",
    filePath: filePath,
  });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      console.log(err.originalError);
      const data = err.originalError.data;
      const message = err.message || "An Error Occured!";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((err, req, res, next) => {
  console.log(err);
  const errorData = err.data;
  res
    .status(err.statusCode || 500)
    .json({ message: err.message, data: errorData });
});

//using mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    console.log("Connected to DB");
    app.listen(8080);
  })
  .catch((err) => console.log(err));

const deleteImage = (imagePath) => {
  imagePath = path.join(__dirname, imagePath);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
