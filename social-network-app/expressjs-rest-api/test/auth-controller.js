const expect = require("chai").expect;
const sinon = require("sinon");
const User = require("../models/user");
const AuthController = require("../controllers/auth");
const mongoose = require("mongoose");
require("dotenv").config();
describe("Auth Controller Testing", () => {
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

  it("should throw an error with code 500 if DB access fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "test1",
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  it("should send a response with a valid user status for an existing user", (done) => {
    const req = {
      userId: "569ed8269353e9f4c51617aa",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    AuthController.getUserStatus(req, res, () => {}).then((result) => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am NEW!");
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
