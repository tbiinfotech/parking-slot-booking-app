const bcrypt = require("bcrypt");
const User = require("../models/users");
const Listing = require("../models/Listing");

const Joi = require('joi');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const { userSchema, updateUserSchema, updateProfileSchema } = require('../../libs/schemaValidation')
const { generateOTP } = require('./../../../utills/authUtils')
const errorHandling = require('../../libs/errorHandling')
const mongoose = require("mongoose");

const { SendEmail } = require('../../libs/Helper')

module.exports.getUser = async (req, res, next) => {
  try {
    const users = await User.find({ email: { $ne: 'admin@gmail.com' } });
    return res.json({
      status: 200,
      response: users,
      success: true,
      message: "Data found",
    });
  } catch (error) {
    console.log("Error while trying to get data-------", error);
    return res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};


module.exports.getUserById = async (req, res) => {
  try {

    // Extract userId from request parameters
    const { id } = req.params;

    // Find user by userId
    const user = await User.findById(id).select('-password');;
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // If user found, return user data
    return res.json({
      status: 200,
      response: user,
      success: true,
      message: "User found",
    });
  } catch (error) {
    console.log("Error while trying to get user by ID:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};  


module.exports.createUser = async (req, res, next) => {
  console.log("-----create_user------");
  try {
    let { name, email, password, confirmPassword, phoneNumber } = req.body;
    const { error } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please try a different email.",
      });
    }

    // Hash password
    if (password) {
      password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    }

    // Generate and send OTP
    const otp = generateOTP();

    let mail_options = {
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      from: `${process.env.MAIL_USERNAME} <${process.env.MAIL_FROM_ADDRESS}>`,
    };

    await SendEmail(mail_options)
      .then((info) => {
        console.log("Nodemailer Email sent ---------- ", info.response);
      })
      .catch((error) => {
        console.log("Nodemailer error ---------- ", error);
      });

    // Save OTP and user data temporarily
    const newUser = await User.create({
      name, email, password, phoneNumber, otp, otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    return res.json({
      status: 200,
      success: true,
      message: "OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};


module.exports.updateUser = async (req, res, next) => {
  try {
    let { name, email, phoneNumber } = req.body;
    const { id } = req.params;

    // Validate request body against the schema
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    // Find the existing user
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User does not exist!",
      });
    }

    // Check if the email needs to be updated
    let emailExists = false;

    // If the email is different from the current user's email, check for duplicates
    if (user.email !== email) {
      emailExists = await User.findOne({ email });
    }

    if (emailExists) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email already exists!",
      });
    }

    // Update the user with new fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { name, email, phoneNumber } },
      { new: true, runValidators: true } // This returns the updated document
    );

    return res.json({
      user: updatedUser,
      status: 200,
      success: true,
      message: "Profile updated",
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    const list = await Listing.find({ owner: id })

    // return res.send(user);
    if (user) {
      await User.findByIdAndDelete(id);

      if (list) {
        await Listing.findByIdAndDelete(list[0]._id);
      }


      return res.json({
        status: 200,
        success: true,
        message: "User deleted",
      });
    } else {
      return res.send({
        status: 400,
        success: false,
        message: "User not exist!",
      });
    }
  } catch (error) {
    console.log("Error while trying to get data-------", error);
    return res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};



