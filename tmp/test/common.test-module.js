process.env.NODE_ENV = "test";
process.env.API_BASE = "/api";

//const User = require("../src/models/user.model");
import { User } from  "../src/models/user.model.js";
import express from "../server.js";
 
export const request = require("supertest")(express);
export const chai = require("chai");
export const should = chai.should();
 
const defaultUser = { "email": "joe@test.com", "password": "test" };
 
const createUser = async () => {
  const UserModel = new User(defaultUser);
  await UserModel.save();
};
 
const getDefaultUser = async () => {
  let users = await User.find({ "email" : defaultUser.email });
  if (users.length === 0) {
    await createUser();
    return getDefaultUser();
  } else {
    return users[0];
  }
};
 
export const loginWithDefaultUser = async () => {
  let user = await getDefaultUser();
  return request.post(process.env.API_BASE + "/auth/signin")
    .send({ "email": defaultUser.email, "password": defaultUser.password })
    .expect(200);
};
 
export const cleanExceptDefaultUser = async () => {
  let user = await getDefaultUser();
  await User.deleteMany({ "email": {$ne: user.email}});  
};