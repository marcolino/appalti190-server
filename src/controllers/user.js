const User = require("../models/user");
const uploader = require("../helpers/uploader");
const sendemail = require("../helpers/sendemail");

/**
 * @route GET api/user
 * @desc get all users
 * @access public, admin
 */
exports.getAll = async function (req, res) {
  const users = await User.find({});
console.log("users:", users)
  res.status(200).json({users});
};

/**
 * @route POST api/user
 * @desc add a new user
 * @access public
 */
exports.store = async (req, res) => {
  try {
    const {email} = req.body;

    // make sure this account doesn't already exist
    const user = await User.findOne({email});
    if (user) return res.status(401).json({message: "The email address you have entered is already associated with another account. You can change this users role instead."});

    const password = "_" + Math.random().toString(36).substring(2, 9); // generate a random password
    const newUser = new User({...req.body, password});

/*
    const user_ = await newUser.save();

    // generate and set password reset token
    user_.generatePasswordResetCode();
*/
    await newUser.save();

    // generate and set password reset token
    user.generatePasswordResetCode();

    // save the updated user object
    await user/*_*/.save();

    // get mail options
    const domain = req.headers.host;
    const subject = "New Account Created";
    const to = user.email;
    const from = process.env.FROM_EMAIL;
    const link = "//" + req.headers.host + "/api/auth/reset/" + user.resetPasswordCode;
    const html = `
<p>Hi, ${user.firstName} ${user.lastName}<p>
<p>A new account has been created for you on ${domain}.</p>
<p>Please click on the following <a href="${link}">link</a> to set your password and login.</p>
<p><i>If you did not request this, please ignore this email.</i></p>`

    await sendemail({to, from, subject, html});

    res.status(200).json({message: "An email has been sent to " + user.email + "."});

  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
};

/**
 * @route GET api/user/{id}
 * @desc gets a specific user
 * @access public
 */
exports.get = async function (req, res) {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) return res.status(401).json({message: "User does not exist"});

    res.status(200).json({user});
  } catch (error) {
    res.status(500).json({message: error.message})
  }
};

/**
 * @route PUT api/user/{id}
 * @desc update user details
 * @access public
 */
exports.update = async function (req, res) {
  try {
    const update = req.body;
    const id = req.params.id;
    const userId = req.user._id;

    // make sure the passed id is that of the logged in user
    if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

    const user1 = await User.findByIdAndUpdate(id, {$set: update}, {new: true}); // TODO: check errors

    // if there is no image, return success message
    if (!req.file) return res.status(200).json({user: user1, message: "User has been updated"});

    // attempt to upload to cloudinary
    const result = await uploader(req);
    const user2 = await User.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true}); // TODO: check errors

    if (!req.file) return res.status(200).json({user: user2, message: "User has been updated"});

  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

/**
 * @route DELETE api/user/{id}
 * @desc delete User
 * @access public
 */
exports.delete = async function (req, res) {
  try {
    const id = req.params.id;
    const user_id = req.user._id;

    // make sure the passed id is that of the logged in user
    if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to delete this data."});

    await User.findByIdAndDelete(id);
    res.status(200).json({message: "User has been deleted"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
