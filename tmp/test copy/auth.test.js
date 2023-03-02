/**
 * Auth routes tests
 */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../server");
const User = require("../src/models/user.model");
const { config } = require ("./config.test");

chai.use(chaiHttp); // use chaiHttp to make the actual HTTP requests

// TODO: handle i18n with res.body.message, for example

describe("API tests - Auth routes", function() {

  before(async() => { // before these tests we empty the database
    // clearing user collection from test database
    User.deleteMany({}, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  it("should register user", function(done) {
    chai.request(server)
      .post("/api/auth/signup")
      .send(config.user)
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(201);
        res.body.should.have.property("code");
        signupConfirmCode = res.body.code;
        done();
      });
    ;
  });

  it("should not register user twice", function(done) {
    chai.request(server)
      .post("/api/auth/signup")
      .send(config.user)
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        done();
      });
    ;
  });

  it("should not login user before confirmation", function(done) {
    chai.request(server)
      .post("/api/auth/signin")
      .send({
        "email": config.user.email,
        "password": config.user.password,
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        res.body.should.have.property("message");
        expect(res.body.message).to.equal("The account is not yet verified");
        done();
      })
    ;
  });

  it("should confirm user", function(done) {
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
    ;
  });

  it("should not confirm user twice", function(done) {
    chai.request(server)
      .post("/api/auth/signupConfirm")
      .send({ code: signupConfirmCode })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        res.body.should.have.property("message");
        expect(res.body.message).to.equal("This account has already been verified");
        done();
      });
    ;
  });

  it("should resend signup code", function(done) {
    chai.request(server)
      .post("/api/auth/resendSignUpCode")
      .send({ email: config.user.email })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        res.body.should.have.property("message");
        expect(res.body.message).to.equal("This account has already been verified, you can log in");
        done();
      });
    ;
  });

  it("should not resend signup code without email", function(done) {
    chai.request(server)
      .post("/api/auth/resendSignUpCode")
      .send({})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(401);
        done();
      });
    ;
  });

  it("should not reset password without email", function(done) {
    chai.request(server)
      .post("/api/auth/resetPassword/email")
      .send({})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        done();
      });
    ;
  });

  it("should start reset password", function(done) {
    chai.request(server)
      .post("/api/auth/resetPassword/email")
      .send({email: config.user.email})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("code");
        resetPasswordCode = res.body.code;
        done();
      });
    ;
  });

  it("should confirm reset password", function(done) {
    chai.request(server)
      .post("/api/auth/resetPasswordConfirm/email/password/code")
      .send({email: config.user.email, password: config.user.password /*+ "-changed"*/, code: resetPasswordCode})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        expect(res.body.message).to.equal("Your password has been updated");
        done();
      });
    ;
  });

  it("should resend reset password code", function(done) {
    chai.request(server)
      .post("/api/auth/resendResetPasswordCode")
      .send({email: config.user.email})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("message");
        expect(res.body.message).to.equal(`A verification code has been sent to ${config.user.email}`);
        done();
      });
    ;
  });

  it("should login user", function(done) {
    chai.request(server)
      .post("/api/auth/signin")
      .send({
        "email": config.user.email,
        "password": config.user.password,
      })
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
//console.log("BODY:", res.body);
        res.should.have.status(200);
        res.body.should.have.property("id");
        res.body.should.have.property("email");
        res.body.should.have.property("roles");
        res.body.should.have.property("plan");
        res.body.should.have.property("accessToken");
        res.body.should.have.property("refreshToken");
        res.body.should.have.property("id");
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        done();
      })
    ;
  });

  it("should not refresh token without refresh token", function(done) {
    chai.request(server)
      .post("/api/auth/refreshtoken")
      .send({})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(403);
        done();
      });
    ;
  });

  it("should refresh token", function(done) {
    chai.request(server)
      .post("/api/auth/refreshtoken")
      .send({refreshToken})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("accessToken");
        res.body.should.have.property("refreshToken");
        done();
      });
    ;
  });

});