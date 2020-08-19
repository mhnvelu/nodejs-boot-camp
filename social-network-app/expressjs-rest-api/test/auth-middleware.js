const authMiddleware = require("../middleware/is-auth");
const expect = require("chai").expect;
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

describe("Auth Middleware Unit Test", () => {
  it("should throw an error if authorization header is not present", () => {
    const req = {
      get: (headerName) => {
        return null;
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Authentication Failed"
    );
  });

  it("should throw an error if authorization header is only one string", () => {
    const req = {
      get: (headerName) => {
        return "xyz";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if toekn cannot be verified", () => {
    const req = {
      get: (headerName) => {
        return "Bearer xyz";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer abcxyz";
      },
    };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});

    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;

    jwt.verify.restore();
  });
});
