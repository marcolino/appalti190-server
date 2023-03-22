/**
 * User routes tests
 */
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../../server");
const User = require("../../src/models/user.model");
const { config } = require ("../config.test");

chai.use(chaiHttp); // use chaiHttp to make the actual HTTP requests

let accessTokenUser, accessTokenAdmin;

const signupAndSigninAllUsers = async() => {
  async() => { // before these tests we empty the database
    // clearing user collection from test database
    User.deleteMany({}, (err) => {
      if (err) {
        console.error(err);
      }
    });
  };

  async() => {
  it("should register normal user", function(done) {
    chai.request(server)
      .post("/api/auth/signup")
      .send({
        "email": config.user.email,
        "password": config.user.password,
      })
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property("code");
        signupConfirmCode = res.body.code;
        chai.request(server)
        .post("/api/auth/signupConfirm")
        .send({ code: signupConfirmCode })
        .then((res) => {
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
      .then((res) => {
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
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property("code");
        signupConfirmCode = res.body.code;
        chai.request(server)
        .post("/api/auth/signupConfirm")
        .send({ code: signupConfirmCode })
        .then((res) => {
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
      .then((res) => {
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

  return { accessTokenUser, accessTokenAdmin };
};


module.exports = {
  signupAndSigninAllUsers
};
