/**
 * User routes tests
 */
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../server");
const User = require("../src/models/user.model");
const Role = require("../src/models/role.model");
const userController = require("../src/controllers/user.controller");
const { config } = require ("./config.test");

chai.use(chaiHttp); // use chaiHttp to make the actual HTTP requests

let accessTokenUser, accessTokenAdmin, adminUserId;

// TODO: handle i18n with res.body.message, for example

describe("API tests - User routes", function() {

  it("login normal user", function(done) {
    chai.request(server)
      .post("/api/auth/signin")
      .send({
        "email": config.user.email,
        "password": config.user.password,
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("accessToken");
        accessTokenUser = res.body.accessToken;
        userId = res.body.id;
console.log("userId:", userId);
        done();
      })
    ;
  });

  it("login admin user", function(done) {
    chai.request(server)
      .post("/api/auth/signin")
      .send({
        "email": config.admin.email,
        "password": config.admin.password,
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("id");
        adminUserId = res.body.id;
        done();
      })
    ;
  });

  describe("overrides admin user's role and login as admin user", function() {
    before(function() {
      User.findOne({ _id: adminUserId }, async (err, user) => {
        if (err) console.error("Could not find user", err);
        if (!user) console.error("Could not find this user");
        Role.find({
          "name": { $in: [ "admin" ] }
        }, (err, docs) => {
          if (err) console.error(err.message);
          user.roles = docs.map(doc => doc._id);
          user.save(err => {
            if (err) console.error(err.message);
          });
        });
      })
    });

    it("should login as admin user", function(done) {
      chai.request(server)
        .post("/api/auth/signin")
        .send(config.admin)
        .end((err, res) => {
          if (err) { console.error("Error:", err); done(); }
          res.should.have.status(200);
          res.body.should.have.property("accessToken");
          res.body.should.have.property("roles");
console.log("res.body.roles:", res.body.roles);
          expect(res.body.roles).to.include("admin");
          accessTokenAdmin = res.body.accessToken;
console.log("accessTokenAdmin:", accessTokenAdmin);
          //adminUserId = res.body.id;
//console.log("adminUserId:", adminUserId);
          done();
        });
      ;
    });

    it("should not get all users with user role", function(done) {
      chai.request(server)
        .get("/api/admin/getAdminPanel")
        .set("x-access-token", accessTokenUser)
        .send({})
        .end((err, res) => {
          if (err) { console.error("Error:", err); done(); }
          res.should.have.status(403);
          done();
        });
      ;
    });

    it("should get all users with admin role", function(done) {
      chai.request(server)
        .get("/api/user")
        .set("x-access-token", accessTokenAdmin)
        .send({})
        .end((err, res) => {
          if (err) { console.error("Error:", err); done(); }
          res.should.have.status(200);
          done();
        });
      ;
    });
  });

});