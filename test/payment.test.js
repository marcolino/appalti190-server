/**
 * Payment routes tests
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

let accessTokenUser, stripeSessionId;

// TODO: do not check res.body.message, it's localized...

describe("API tests - Payment routes", function() {

  before(async() => { // before these tests we empty the database
    // clearing user collection from test database
    User.deleteMany({}, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  it("should register normal user", function(done) {
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

  it("should login normal user", function(done) {
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

  it("should get payment mode, and it should be in a set of values", function(done) {
    chai.request(server)
      .get("/api/payment/mode")
      .set("x-access-token", accessTokenUser)
      .send({})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        expect(res.body.mode).to.be.oneOf(["test", "live"]);
        done();
      });
    ;
  });

  it("should not create a checkout session without authentication", function(done) {
    chai.request(server)
      .post("/api/payment/create-checkout-session")
      //.set("x-access-token", accessTokenUser)
      .send({})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(403);
        done();
      });
    ;
  });

  it("should not create a checkout session for a 0 cost product", function(done) {
    chai.request(server)
      .post("/api/payment/create-checkout-session")
      .set("x-access-token", accessTokenUser)
      .send({product: "free"})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(400);
        done();
      });
    ;
  });

  it("should create a checkout session for a standard product", function(done) {
    chai.request(server)
      .post("/api/payment/create-checkout-session")
      .set("x-access-token", accessTokenUser)
      .send({product: "standard"})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("session");
        stripeSessionId = res.body.session.id;
        done();
      });
    ;
  });

  it("should redirect on a payment success call", function(done) {
    chai.request(server)
      .get("/api/payment/payment-success")
      .query({session_id: stripeSessionId})
      .redirects(0)
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(302);
        done();
      });
    ;
  });

  it("should redirect on a payment canceled call", function(done) {
    chai.request(server)
      .get("/api/payment/payment-cancel")
      .query({session_id: stripeSessionId})
      .redirects(0)
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(302);
        done();
      });
    ;
  });
    
});