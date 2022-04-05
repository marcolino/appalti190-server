//const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const User = require("../src/models/user.model");

// during the test the env variable is set to test
process.env.NODE_ENV = "test";

chai.use(chaiHttp);
const expect = chai.expect;

// our parent block
describe("Testing users", async() => {
  const adminUser = new User({
    firstName: "Joe",
    lastName: "Admin",
    email: "administrator@email.com",
  });

  beforeEach(async() => { // before each test we empty the database
    User.deleteMany({}, (err) => { 
      if (err) {
        console.error(err);
      }
    });
    await adminUser.save(err => {
      if (err) { throw new Error(`Can't add user: ${err}`); }
    });
    await adminUser.save(err => {
      if (!err) { throw new Error("Saving user twice should generate error"); }
    });
  });

  describe("GET /api/user", () => {
    it("should get all the users", (done) => {
    chai.request(server)
      .get("/api/user")
      .end((err, res) => {
        if (err) {
          console.error("err:", err);
        }
        expect(res).to.be.json;
        expect(res.status).to.be.eql(200);
        expect(res.body).to.be.an("object");
        expect(res.body.users).to.be.an("array");
        expect(res.body.users.length).to.be.eql(1);
        done();
      });
    });
  });

});