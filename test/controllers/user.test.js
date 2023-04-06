/**
 * User routes tests
 */
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../../server");
const User = require("../../src/models/user.model");
//const { signupAndSigninAllUsers } = require ("../utils/common.test");
const { config } = require("../config.test");

chai.use(chaiHttp); // use chaiHttp to make the actual HTTP requests

const validFiscalCode = "RSSMRA74D22A001Q";
let accessTokenUser, accessTokenAdmin;
//let { accessTokenUser, accessTokenAdmin } = require ("./utils/common.test");

describe("API tests - User routes", async function() {

  before(async() => { // before these tests we empty the database
    // clearing user collection from test database
    User.deleteMany({}, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  signupAndSigninAllUsers();

  it("should not get all users with full info with user role", function(done) {
    chai.request(server)
      .get("/api/user/getAllUsersWithFullInfo")
      .set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should get all users with full info with admin role", function(done) {
    chai.request(server)
      .get("/api/user/getAllUsersWithFullInfo")
      .set("x-access-token", accessTokenAdmin)
      .send({})
      .then(res => {
        res.should.have.status(200);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not get all roles without authentication", function(done) {
    chai.request(server)
      .get("/api/user/getAllRoles")
      .send({})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should get all roles", function(done) {
    chai.request(server)
      .get("/api/user/getAllRoles")
      .set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not get alls plans without authentication", function(done) {
    chai.request(server)
      .get("/api/user/getAllPlans")
      .send({})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should get all plans", function(done) {
    chai.request(server)
      .get("/api/user/getAllPlans")
      .set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should get user's profile", function(done) {
    chai.request(server)
      .get("/api/user/getProfile")
      .set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("user");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not get user's profile without authentication", function(done) {
    chai.request(server)
      .get("/api/user/getProfile")
      //.set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not get another user's profile without admin access", function(done) {
    chai.request(server)
      .get("/api/user/getProfile")
      .set("x-access-token", accessTokenUser)
      .send({userId: config.admin.id})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should get another user's profile with admin access", function(done) {
    chai.request(server)
      .get("/api/user/getProfile")
      .set("x-access-token", accessTokenAdmin)
      .send({userId: config.admin.id})
      .then(res => {
        res.should.have.status(200);
        done();
      })
      .catch((err) => {
        done(err);
      })
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
        fiscalCode: validFiscalCode,
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
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's profile with invalid email", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.admin.id,
        email: "invalid email",
      })
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's profile with already taken email", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.admin.id,
        email: config.user.email,
      })
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update user's profile with new email", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.admin.id,
        email: config.admin.email + ".new",
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should reset user's profile with email", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.admin.id,
        email: config.admin.email,
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's profile with invalid firstName", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.admin.id,
        firstName: "",
      })
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's profile with invalid lastName", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.admin.id,
        lastName: "",
      })
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's profile with invalid fiscalCode", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.admin.id,
        fiscalCode: "",
      })
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
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
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's profile for a different not existent user - without admin access", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenUser)
      .send({
        userId: "123456789012345678901234",
        firstName: config.user.name + "-bis",
      })
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's profile for a different existent user - without admin access", function(done) {
    chai.request(server)
      .post("/api/user/updateProfile")
      .set("x-access-token", accessTokenUser)
      .send({
        userId: config.user.id,
        firstName: config.user.name + "-bis",
      })
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
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
      .then(res => {
        res.should.have.status(200);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update another user's own property without admin access", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenUser)
      .send({
        userId: config.user.id,
        payload: {
          firstName: "updated first name",
        }
      })
      .then(res => {
        res.should.have.status(403);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update another user's property with admin access", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.user.id,
        payload: {
          firstName: "updated first name",
        }
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's property with an unexpected payload", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenAdmin)
      .send({
        payload: {
          unexpected: "abc",
        }
      })
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
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
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update user's own property email", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenUser)
      .send({
        payload: {
          email: config.user.email,
        }
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update user's own property lastName", function(done) {
    chai.request(server)
      .post("/api/user/updateUserProperty")
      .set("x-access-token", accessTokenUser)
      .send({
        payload: {
          lastName: "updated last name",
        }
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
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
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
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
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
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
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's own roles without admin access", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's own roles with not array roles", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({roles: "user"})
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's own roles with empty array roles", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({roles: []})
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update user's own roles without admin access (equal or down grade)", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({
        roles: [ "user" ]
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's own roles without admin access (up grade)", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({
        roles: [ "admin" ],
      })
      .then(res => {
        res.should.have.status(403);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update user's own roles as admin user (up grade)", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenAdmin)
      .send({
        roles: [ "admin" ],
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update another user's roles without admin access", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenUser)
      .send({
        userId: config.admin.id,
      })
      .then(res => {
        res.should.have.status(403);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update another user's roles with admin access", function(done) {
    chai.request(server)
      .post("/api/user/updateRoles")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.admin.id,
        roles: [ "admin" ],
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  ////////////////////////// START
  it("should not update user's own plan without admin access", function(done) {
    chai.request(server)
      .post("/api/user/updatePlan")
      .set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's own plan with no plan", function(done) {
    chai.request(server)
      .post("/api/user/updatePlan")
      .set("x-access-token", accessTokenUser)
      .send({
        noPlan: "wrong plan"
      })
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update user's own plan with empty plan", function(done) {
    chai.request(server)
      .post("/api/user/updatePlan")
      .set("x-access-token", accessTokenUser)
      .send({
        plan: ""
      })
      .then(res => {
        res.should.have.status(400);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update user's own plan (equal or down grade)", function(done) {
    chai.request(server)
      .post("/api/user/updatePlan")
      .set("x-access-token", accessTokenUser)
      .send({
        plan: [ "free" ]
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update another user's plan with admin access", function(done) {
    chai.request(server)
      .post("/api/user/updatePlan")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.user.id,
        plan: "standard",
      })
      .then(res => {
        res.should.have.status(200);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });
  it("should not update user's own plan without admin access (up grade)", function(done) {
    chai.request(server)
      .post("/api/user/updatePlan")
      .set("x-access-token", accessTokenUser)
      .send({
        plan: "unlimited",
      })
      .then(res => {
        res.should.have.status(403);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update user's own plan as admin user (up grade)", function(done) {
    chai.request(server)
      .post("/api/user/updatePlan")
      .set("x-access-token", accessTokenAdmin)
      .send({
        plan: "unlimited",
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not update another user's plan without admin access", function(done) {
    chai.request(server)
      .post("/api/user/updatePlan")
      .set("x-access-token", accessTokenUser)
      .send({
        userId: config.admin.id,
      })
      .then(res => {
        res.should.have.status(403);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should update another user's plan with admin access", function(done) {
    chai.request(server)
      .post("/api/user/updatePlan")
      .set("x-access-token", accessTokenAdmin)
      .send({
        userId: config.admin.id,
        plan: "unlimited",
      })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  ////////////////////////// END

it("should not get all users with user role", function(done) {
    chai.request(server)
      .get("/api/user/getAllUsers")
      .set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not get all users with wrong filter", function(done) {
    chai.request(server)
      .get("/api/user/getAllUsers")
      .set("x-access-token", accessTokenAdmin)
      .send({ filter: "wrong filter" })
      .then(res => {
        res.should.have.status(400);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should get all users with admin role", function(done) {
    chai.request(server)
      .get("/api/user/getAllUsers")
      .set("x-access-token", accessTokenAdmin)
      .send({})
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("users");
        //console.log("# of users is", res.body.users.length);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not delete user without authentication", function(done) {
    chai.request(server)
      .post("/api/user/delete")
      .send({})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not delete user without admin privileges", function(done) {
    chai.request(server)
      .post("/api/user/delete")
      .set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not delete user with admin privileges using invalid id", function(done) {
    chai.request(server)
      .post("/api/user/delete")
      .set("x-access-token", accessTokenAdmin)
      .send({ filter: {id: "invalid user id"} })
      .then(res => {
        res.should.have.status(400);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should delete user with admin privileges using id", function(done) {
    chai.request(server)
      .post("/api/user/delete")
      .set("x-access-token", accessTokenAdmin)
      .send({ filter: { _id: config.user.id } })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("count");
        expect(res.body.count).to.equal(1);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should delete user with admin privileges using email", function(done) {
    chai.request(server)
      .post("/api/user/delete")
      .set("x-access-token", accessTokenAdmin)
      .send({ filter: { email: config.admin.email } })
      .send({})
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("count");
        expect(res.body.count).to.equal(1);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  signupAndSigninAllUsers();

  it("should not remove user without authentication", function(done) {
    chai.request(server)
      .post("/api/user/remove")
      .send({})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not remove user without admin privileges", function(done) {
    chai.request(server)
      .post("/api/user/remove")
      .set("x-access-token", accessTokenUser)
      .send({})
      .then(res => {
        res.should.have.status(403);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should not remove user with admin privileges using invalid id", function(done) {
    chai.request(server)
      .post("/api/user/remove")
      .set("x-access-token", accessTokenAdmin)
      .send({ filter: {id: "invalid user id"} })
      .then(res => {
        res.should.have.status(400);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should remove user with admin privileges using id", function(done) {
    chai.request(server)
      .post("/api/user/remove")
      .set("x-access-token", accessTokenAdmin)
      .send({ filter: { _id: config.user.id } })
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("count");
        expect(res.body.count).to.equal(1);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should remove user with admin privileges using email", function(done) {
    chai.request(server)
      .post("/api/user/remove")
      .set("x-access-token", accessTokenAdmin)
      .send({ filter: { email: config.admin.email } })
      .send({})
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("count");
        expect(res.body.count).to.equal(1);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  it("should remove all users with admin privileges", function(done) {
    chai.request(server)
      .post("/api/user/remove")
      .set("x-access-token", accessTokenAdmin)
      .send({ filter: "*" })
      .send({})
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property("count");
        expect(res.body.count).to.be.at.least(1);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
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