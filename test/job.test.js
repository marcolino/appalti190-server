/**
 * Job routes tests
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

let accessTokenUser, accessTokenAdmin, accessTokenadminstandardplan;

// TODO: do not check res.body.message, it's localized...

describe("API tests - Job routes", function() {

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

  it("should register admin user", function(done) {
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

  it("should register admin user with standard plan", function(done) {
    chai.request(server)
      .post("/api/auth/signup")
      .send({
        "email": config.adminstandardplan.email,
        "password": config.adminstandardplan.password,
        "forcerole": "admin",
        "forceplan": "standard",
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
          done();
        });
      })
    ;
  });

  it("should login as admin user with standard plan", function(done) {
    chai.request(server)
      .post("/api/auth/signin")
      .send(config.adminstandardplan)
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("accessToken");
        res.body.should.have.property("roles");
        res.body.should.have.property("id");
        expect(res.body.roles).to.include("admin");
        accessTokenadminstandardplan = res.body.accessToken;
        config.admin.id = res.body.id;
        done();
      });
    ;
  });

  it("should not upload a file without authentication", function(done) {
    chai.request(server)
      .post("/api/job/upload")
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(403);
        done();
      });
    ;
  });

  it("should upload a file as normal user", function(done) {
    chai.request(server)
      .post("/api/job/upload")
      .set("x-access-token", accessTokenUser)
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        done();
      });
    ;
  });

  it("should not transform XLS to XML without authentication", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(403);
        done();
      });
    ;
  });

  it("should not transform XLS to XML as normal user (not existing file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenUser)
      .send({filePath: "NOT EXISTING FILE"})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("ABORTED_DUE_TO_ERROR_READING_INPUT_FILE"),
        done();
      });
    ;
  });
  
  it("should transform XLS to XML as normal user (some errors file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenUser)
      .send({filePath: "test/assets/xls/AVCP 2023 some errors.xlsx"})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        res.body.should.have.property("warnings");
        expect(res.body.warnings).to.be.an("array");
        expect(res.body.errors).to.be.an("array");
        done();
      });
    ;
  });

  it("should transform XLS to XML as normal user (more errors file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenUser)
      .send({filePath: "test/assets/xls/AVCP 2023 more errors.xlsx"})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        res.body.should.have.property("warnings");
        expect(res.body.warnings).to.be.an("array");
        expect(res.body.errors).to.be.an("array");
        done();
      });
    ;
  });

  it("should transform XLS to XML as admin user with standard plan, truncating (good file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenadminstandardplan)
      .send({filePath: "test/assets/xls/AVCP 2023 good.xlsx"})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        res.body.should.have.property("truncatedDueToPlanLimit");
        expect(res.body.truncatedDueToPlanLimit).to.be.a("boolean");
        expect(res.body.truncatedDueToPlanLimit).to.equal(true);
        done();
      });
    ;
  });

  it("should transform XLS to XML as normal user (good file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenUser)
      .send({filePath: "test/assets/xls/AVCP 2023 good.xlsx"})
      .end((err, res) => {
        if (err) { console.error("Error:", err); done(); }
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        done();
      });
    ;
  });
  
});