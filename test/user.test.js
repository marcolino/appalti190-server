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

// TODO: do not check res.body.message, it's localized...

describe("API tests - User routes", function() {

  before(async() => { // before these tests we empty the database
    // clearing user collection from test database
    User.deleteMany({}, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  it("register normal user", function(done) {
    chai.request(server)
      .post("/api/auth/signup")
      .send({
        "email": config.user.email,
        "password": config.user.password,
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(201);
        res.body.should.have.property("code");
        signupConfirmCode = res.body.code;
        chai.request(server)
        .post("/api/auth/signupConfirm")
        .send({ code: signupConfirmCode })
        .end((err, res) => {
          if (err) { console.error("Error:", err); done(); }
          res.should.have.status(200);
          res.body.should.have.property("message");
          expect(res.body.message).to.equal("The account has been verified, you can now log in");
          done();
        });
      })
    ;
  });

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
        res.body.should.have.property("id");
        accessTokenUser = res.body.accessToken;
        config.user.id = res.body.id;
        done();
      })
    ;
  });

  it("register admin user", function(done) {
    chai.request(server)
      .post("/api/auth/signup")
      .send({
        "email": config.admin.email,
        "password": config.admin.password,
        "forcerole": "admin",
        "forceplan": "unlimited",
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(201);
        res.body.should.have.property("code");
        signupConfirmCode = res.body.code;
        chai.request(server)
        .post("/api/auth/signupConfirm")
        .send({ code: signupConfirmCode })
        .end((err, res) => {
          if (err) { console.error("Error:", err); done(); }
          res.should.have.status(200);
          res.body.should.have.property("message");
          expect(res.body.message).to.equal("The account has been verified, you can now log in");
          done();
        });
      })
    ;
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
        res.body.should.have.property("id");
        expect(res.body.roles).to.include("admin");
        accessTokenAdmin = res.body.accessToken;
        config.admin.id = res.body.id;
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

  it("should get user's profile", function(done) {
    chai.request(server)
      .get("/api/user/getProfile")
      .set("x-access-token", accessTokenUser)
      .send({})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("user");
        done();
      });
    ;
  });

  it("should not get user's profile without authentication", function(done) {
    chai.request(server)
      .get("/api/user/getProfile")
      //.set("x-access-token", accessTokenUser)
      .send({})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(403);
        done();
      });
    ;
  });

  it("should update user's profile", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenUser)
      .send({
        email: config.user.email,
        firstName: "updated first name",
        lastName: "updated last name",
        //fiscalCode: "XXXYYY11A22Z999A",
        businessName: "test business name",
        address: {
          street: "Solari street",
          streetNo: "0",
          city: "Rivoli",
          province: "TO",
          zip: "10100",
          country: "Italy",
        },
        roles: [ "user" ],
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should not update user's profile without autentication", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      //.set("x-access-token", accessTokenUser)
      .send({
        userId: config.user.id,
        email: config.user.email,
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(403);
        done();
      });
    ;
  });

  it("should not update user's profile for a different not existent user - as normal user", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenUser)
      .send({
        userId: "111111111111111111111111",
        firstName: config.user.name + "-bis",
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        done();
      });
    ;
  });

  it("should not update user's profile for a different existent user - as normal user", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenUser)
      .send({
        userId: config.user.id,
        firstName: config.user.name + "-bis",
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        done();
      });
    ;
  });

  it("should update user's profile for a different existent user - as admin user", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.user.id,
        firstName: config.user.name + "-bis",
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        done();
      });
    ;
  });

  it("should update user's own property firstName", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenUser)
      .send({
        payload: {
          firstName: "updated first name",
        }
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should update user's own property lastName", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenUser)
      .send({
        payload: {
          lastName: "updated last name",
        // fiscalCode: "XXXYYY11A22Z999A",
        // businessName: "test business name",
        // address: {
        //   street: "Solari street",
        //   streetNo: "0",
        //   city: "Rivoli",
        //   province: "TO",
        //   zip: "10100",
        //   country: "Italy",
        // },
        // roles: [ "user" ],
        }
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should update user's own property fiscalCode", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenUser)
      .send({
        payload: {
          fiscalCode: config.user.fiscalCode,
        }
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should update user's own property businessName", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenUser)
      .send({
        payload: {
          businessName: "test business name",
        }
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should update user's own property address street", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenUser)
      .send({
        payload: {
          address: { street: config.user.address.street },
        }
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should not update user's own roles as normal user (no roles)", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should not update user's own roles as normal user (not array roles)", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({roles: "user"})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should not update user's own roles as normal user (empty array role)", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({roles: []})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should update user's own roles as normal user (equal or down grade)", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({
        roles: [ "user" ]
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  // it("should not update user's own roles as normal user (up grade)", function(done) {
  //   chai.request(server)
  //     .post("/api/user/updateRoles")
  //     .set("x-access-token", accessTokenUser)
  //     .send({
  //       roles: [ "admin" ],
  //     })
  //     .end((err, res) => {
  //       if (err) { console.error("Error:", err); done(); }
  //       res.should.have.status(403);
  //       res.body.should.have.property("message");
  //       done();
  //     });
  //   ;
  // });

  it("should update user's own roles as admin user (up grade)", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenAdmin)
      .send({
        roles: [ "admin" ],
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      });
    ;
  });

  it("should not get all users with user role", function(done) {
    chai.request(server)
      .get("/api/user/getUsers")
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
      .get("/api/user/getUsers")
      .set("x-access-token", accessTokenAdmin)
      .send({})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("users");
        //console.log("# of users is", res.body.users.length);
        done();
      });
    ;
  });

});