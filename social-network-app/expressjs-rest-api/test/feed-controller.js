const expect = require("chai").expect;
const sinon = require("sinon");
const User = require("../models/user");
const FeedController = require("../controllers/feed");
const mongoose = require("mongoose");
const post = require("../models/post");
require("dotenv").config();
const io = require("../websocket");
describe("Feed Controller Testing", () => {
  before(function (done) {
    mongoose
      .connect(
        `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.TEST_DB}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
      )
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          name: "Test",
          password: "test1",
          posts: [],
          _id: mongoose.Types.ObjectId("569ed8269353e9f4c51617aa"),
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("should add a created post to the posts of creator", (done) => {
    const req = {
      body: {
        title: "post1",
        content: "post1 content",
      },
      userId: "569ed8269353e9f4c51617aa",
      file: {
        path: "images/post1",
      },
    };

    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.message = data.message;
      },
    };

    sinon.stub(io, "getIO");
    io.getIO.returns({ emit: function () {} });

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser.posts).to.have.length(1);
      io.getIO.restore();
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return post.deleteMany({});
      })
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
