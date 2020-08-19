const authMiddleware = require("../middleware/is-auth");
const expect = require("chai").expect;

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
});
