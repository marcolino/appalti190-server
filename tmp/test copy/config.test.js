process.env.NODE_ENV = "test";

// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const should = chai.should();
// const expect = chai.expect;
// var server = require("../server");
// var User = require("../src/models/user.model");

// chai.use(chaiHttp); // use chaiHttp to make the actual HTTP requests

const config = {
  admin: {
    name: "Alice",
    surname: "Azure",
    email: "admin@mail.com",
    password: "admin!",
  },
  user: {
    name: "Bob",
    surname: "Blue",
    email: "user@mail.com",
    password: "user!",
  }
};

module.exports = { config };
