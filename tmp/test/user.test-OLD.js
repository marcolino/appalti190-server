//const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const Role = require("../src/models/role.model");
const User = require("../src/models/user.model");

// during the test the env variable is set to test
process.env.NODE_ENV = "test";

chai.use(chaiHttp);
const expect = chai.expect;


describe('Todo API', function() {

  before(async() => { // before these tests we empty the database
    User.deleteMany({}, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  it('should Register user, login user, check token and delete a todo on /todo/<id> DELETE', function(done) {
      chai.request(server)

          // register request
          .post('/auth/register')

          // send user registration details
          .send({
                  'fullName': 'Paul Oluyege',
                  'email': 'tester@gmail.com',
                  'password': 'tester'
              }

          ) // this is like sending $http.post or this.http.post in Angular
          .end((err, res) => { // when we get a resonse from the endpoint

              // in other words,
              // the res object should have a status of 201
              res.should.have.status(201);

              // follow up with login
              chai.request(server)
                  .post('/auth/sign_in')
                  // send user login details
                  .send({
                      'email': 'tester@gmail.com',
                      'password': 'tester'
                  })
                  .end((err, res) => {
                      console.log('this runs the login part');
                      res.body.should.have.property('token');
                      var token = res.body.token;

                      // follow up with requesting user protected page
                      chai.request(server)
                          .get('/todos')
                          .end(function(err, res) {
                              chai.request(server)
                                  .delete('/todo/' + res.body[0]._id)

                                  // we set the auth header with our token
                                  .set('Authorization', 'JWT ' + token)
                                  .end(function(error, resonse) {
                                      resonse.should.have.status(200);
                                      resonse.body.should.have.property('message');
                                      resonse.body.message.should.equal('Authorized User, Action Successful!');
                                      done();
                                  });
                          })
                  })
          })
  })
})
/*
// our parent block
describe("Testing users", async() => {
  const adminUser = new User({
    firstName: "Joe",
    lastName: "Admin",
    email: "marcosolari@gmail.com",
    password: "Laserin0!",
  });
  Role.findOne({
    "name": "admin"
  }, (err, doc) => {
    if (err) return res.status(500).json({ message: err.message });
    adminUser.roles = doc;
    adminUser.save(err => {
      if (err) { throw new Error(`Can't save user: ${err}`); }
    });
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
*/