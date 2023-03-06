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
    fiscalCode: "CGNNMO80A01A001T",
    address: {
      street: "Solari street",
      streetNo: "0",
      city: "Rivoli",
      province: "TO",
      zip: "10100",
      country: "Italy",
    },
  },
  user: {
    name: "Bob",
    surname: "Blue",
    email: "user@mail.com",
    password: "user!",
    fiscalCode: "CGNNMO81A01A001U",
    address: {
      street: "Solari street",
      streetNo: "1",
      city: "Rivoli",
      province: "TO",
      zip: "10100",
      country: "Italy",
    },
  }
};

module.exports = { config };
