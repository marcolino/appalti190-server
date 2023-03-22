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
const { config } = require("./config.test");

chai.use(chaiHttp); // use chaiHttp to make the actual HTTP requests

let accessTokenUser, accessTokenadminstandardplan;
let transformOne = {
  "xmlIndice": null,
  "xml": null,
  "outputFile": "/home/marco/apps/sistemisolari/appalti190-server/public/downloads/marcosolari@gmail.com/dataset-2022.xml",
};
let transformOneNoOutputFile = {
  "xmlIndice": null,
  "xml": null,
  "outputFile": "/home/marco/apps/sistemisolari/appalti190-server/public/downloads/marcosolari@gmail.com/dataset-2022.xml-NOTEXISTENT",
};

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
          //expect(res.body.message).to.equal("The account has been verified, you can now log in");
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

  it("should register admin user with standard plan", function(done) {
    chai.request(server)
      .post("/api/auth/signup")
      .send({
        "email": config.adminstandardplan.email,
        "password": config.adminstandardplan.password,
        "forcerole": "admin",
        "forceplan": "standard",
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

  it("should login as admin user with standard plan", function(done) {
    chai.request(server)
      .post("/api/auth/signin")
      .send(config.adminstandardplan)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("accessToken");
        res.body.should.have.property("roles");
        res.body.should.have.property("id");
        expect(res.body.roles).to.include("admin");
        accessTokenadminstandardplan = res.body.accessToken;
        config.admin.id = res.body.id;
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not upload a file without authentication", function(done) {
    chai.request(server)
      .post("/api/job/upload")
      .then((res) => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should upload a file as normal user", function(done) {
    chai.request(server)
      .post("/api/job/upload")
      .set("x-access-token", accessTokenUser)
      .then((res) => {
        res.should.have.status(200);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not transform XLS to XML without authentication", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .then((res) => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not transform XLS to XML as normal user (not existing file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenUser)
      .send({filePath: "NOT EXISTING FILE"})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("ABORTED_DUE_TO_ERROR_READING_INPUT_FILE"),
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });
  
  it("should transform XLS to XML as normal user (some errors file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenUser)
      .send({filePath: "test/assets/xls/AVCP 2023 some errors.xlsx"})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        res.body.should.have.property("warnings");
        expect(res.body.warnings).to.be.an("array");
        expect(res.body.errors).to.be.an("array");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should transform XLS to XML as normal user (more errors file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenUser)
      .send({filePath: "test/assets/xls/AVCP 2023 more errors.xlsx"})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        res.body.should.have.property("warnings");
        expect(res.body.warnings).to.be.an("array");
        expect(res.body.errors).to.be.an("array");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should transform XLS to XML as admin user with standard plan, truncating (good file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenadminstandardplan)
      .send({filePath: "test/assets/xls/AVCP 2023 good.xlsx"})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        res.body.should.have.property("truncatedDueToPlanLimit");
        expect(res.body.truncatedDueToPlanLimit).to.be.a("boolean");
        expect(res.body.truncatedDueToPlanLimit).to.equal(true);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should transform XLS to XML as normal user (good file)", function(done) {
    chai.request(server)
      .post("/api/job/transformXls2Xml/filePath")
      .set("x-access-token", accessTokenUser)
      .send({filePath: "test/assets/xls/AVCP 2023 good.xlsx"})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });
  
  it("should not validate XML without authentication", function(done) {
    chai.request(server)
      .post("/api/job/validateXml/transform")
      //.set("x-access-token", accessTokenUser)
      .send({transform: transformOne})
      .then((res) => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should validate XML (one output file ok)", function(done) {
    chai.request(server)
      .post("/api/job/validateXml/transform")
      .set("x-access-token", accessTokenUser)
      .send({transform: transformOne})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not validate XML (one output file, no file)", function(done) {
    chai.request(server)
      .post("/api/job/validateXml/transform")
      .set("x-access-token", accessTokenUser)
      .send({transform: transformOneNoOutputFile})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("CANNOT_READ_XML"),
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should validate XML (index output file ok)", function(done) {
    chai.request(server)
      .post("/api/job/validateXml/transform")
      .set("x-access-token", accessTokenUser)
      .send({transform: transformOne})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

/*
  it("should check outcome", function(done) {
    chai.request(server)
      .post("/api/job/outcomeCheck/anno/codiceFiscaleAmministrazione")
      .set("x-access-token", accessTokenUser)
      .send({anno: "...", codiceFiscaleAmministrazione: "..."})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should check url existence and match", function(done) {
    chai.request(server)
      .post("/api/job/urlExistenceAndMatch/url/fileToMatch")
      .set("x-access-token", accessTokenUser)
      .send({url: "...", fileToMatch: "..."})
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property("code");
        expect(res.body.code).to.equal("OK"),
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should validate XML (good file)", function(done) {
    chai.request(server)
      .get("/api/job/getPlans")
      .set("x-access-token", accessTokenUser)
      .send()
      .then((res) => {
        res.should.have.status(200);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });
*/

});