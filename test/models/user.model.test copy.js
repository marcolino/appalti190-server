/**
 * User model tests
 */
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../../server");
const User = require("../../src/models/user.model");
const { config } = require("../config.test");

chai.use(chaiHttp); // use chaiHttp to make the actual HTTP requests

let accessTokenUser, accessTokenAdmin;

describe("API tests - User model", async function() {

  before(async() => { // before these tests we empty the database
    // clearing user collection from test database
    User.deleteMany({}, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  signupAndSigninAllUsers();

  it("user model should not save user with wrong type password", function(done) {
    User.findOne({email: config.user.email}, async(err, user) => {
      should.exist(user);
      let password = {};
      user.hashPassword(password, (err, hash) => {
        should.exist(err);
        should.not.exist(hash);
        expect(err.message).to.equal("Illegal arguments: object, string");
        done();
      });
    });
  });

  it("user model should handle options set as true", function(done) {
    User.find({email: config.user.email}, null, {allowDeleted: true, allowUnverified: true}, (err, user) => {
      should.exist(user);
      done();
    })
    .catch((err) => {
      done(err);
    });
  });

  it("user model should handle options set as false", function(done) {
    User.find({email: config.user.email}, null, {allowDeleted: false, allowUnverified: false}, (err, user) => {
      should.exist(user);
      done();
    })
  });

  it("hashPassword should fail with a password of type object", function(done) {
    User.findOne({email: config.user.email}, (err, user) => {
      let password = {};
      user.hashPassword(password, (err, passwordHashed) => {
        should.exist(err);
        expect(err.message).to.equal("Illegal arguments: object, string");
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
  });
});

function signupAndSigninAllUsers() {
  it("should register normal user", function(done) {
    chai.request(server)
      .post("/api/auth/signup")
      .send({
        "email": config.user.email,
        "password": config.user.password,
      })
      .then(res => {
        res.should.have.status(201);
        res.body.should.have.property("code");
        signupConfirmCode = res.body.code;
        chai.request(server)
        .post("/api/auth/signupConfirm")
        .send({ code: signupConfirmCode })
        .then(res => {
          res.should.have.status(200);
          res.body.should.have.property("message");
          done();
        })
        .catch((err) => {
          done(err);
        })
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should login normal user", function(done) {
    chai.request(server)
      .post("/api/auth/signin")
      .send({
        "email": config.user.email,
        "password": config.user.password,
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("accessToken");
        res.body.should.have.property("id");
        accessTokenUser = res.body.accessToken;
        config.user.id = res.body.id;
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should register admin user", function(done) {
    chai.request(server)
      .post("/api/auth/signup")
      .send({
        "email": config.admin.email,
        "password": config.admin.password,
        "forcerole": "admin",
        "forceplan": "unlimited",
      })
      .then(res => {
        res.should.have.status(201);
        res.body.should.have.property("code");
        signupConfirmCode = res.body.code;
        chai.request(server)
        .post("/api/auth/signupConfirm")
        .send({ code: signupConfirmCode })
        .then(res => {
          res.should.have.status(200);
          res.body.should.have.property("message");
          done();
        })
        .catch((err) => {
          done(err);
        })  
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should login as admin user", function(done) {
    chai.request(server)
      .post("/api/auth/signin")
      .send(config.admin)
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("accessToken");
        res.body.should.have.property("roles");
        res.body.should.have.property("id");
        expect(res.body.roles).to.include("admin");
        accessTokenAdmin = res.body.accessToken;
        config.admin.id = res.body.id;
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });
};