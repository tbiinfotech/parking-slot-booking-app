"use strict";

const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Otp = require("../models/otp");
const { signInSchema, emailSchema, passwordSchema } = require('../../libs/schemaValidation')
const { SendEmail } = require('../../libs/Helper')
const { generateOTP } = require('./../../../utills/authUtils')


module.exports.SignIn = async (req, res, next) => {
  try {
    let request_body = req.body;
    const { error } = signInSchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const user_detail = await User.findOne({
      email: req.body.email,
    });

    if (
      !user_detail ||
      !(await bcrypt.compare(request_body.password, user_detail.password))
    ) {
      return res.status(500).json({
        success: false,
        message: "Username or password is incorrect",
      });
    }

    var token = token = jwt.sign(
      { user_id: user_detail.id, role: "user" },
      process.env.jwt_token_key,
      { expiresIn: "8h" }
    );

    const userData = {
      id: user_detail._id,
      name: user_detail.name,
      email: user_detail.email,
      role: user_detail.role,
      age: user_detail.age,
      status: user_detail.status,
    };

    return res.json({
      user: userData,
      status: 200,
      token: token,
      success: true,
      message: "Log in successful",
    });
  } catch (error) {
    console.log("SignIn error -------", error);
    return res.send({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log('user :', user)

    console.log('user otp :', user.otp)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is incorrect or has expired.",
      });
    }

    // OTP is correct, finalize registration
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true; // Set user as verified
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user._id, role: "user" },
      process.env.jwt_token_key,
      { expiresIn: "8h" }
    );

    return res.json({
      status: 200,
      success: true,
      token,
      message: "Your account has been verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during OTP verification.",
    });
  }
};


module.exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = emailSchema.validate({ email });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp); // For debugging

    const token = jwt.sign(
      { user_id: user._id, role: "user" },
      process.env.jwt_token_key,
      { expiresIn: "8h" }
    );

    // Update OTP and expiration time
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        otp,
        token,
        tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        otpExpires: Date.now() + 10 * 60 * 1000, // 5 minutes expiration
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update OTP" });
    }

    // Debugging logs to confirm
    console.log("Updated User:", updatedUser);



    const mailOptions = {
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
      from: `${process.env.MAIL_USERNAME} <${process.env.MAIL_FROM_ADDRESS}>`,
    };

    await SendEmail(mailOptions)
      .then((info) => {
        console.log("Email sent: ", info.response);
      })
      .catch((error) => {
        console.log("Email error: ", error);
      });

    return res.status(200).json({ message: "OTP sent to your email", token });
  } catch (error) {
    console.error("Error in Forgot Password: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports.resendOtp = async (req, res, next) => {
  console.log("-----resendOtp------");
  try {
    let { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
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


    // Update OTP and expiration time
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000, // 5 minutes expiration
      },
      { new: true } // Return the updated document
    );

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


module.exports.ResetPassword = async (req, res) => {
  try {
    const { email, newPassword, token } = req.body;

    // Validate new password
    const { error } = passwordSchema.validate({ newPassword });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the provided token matches the stored token and has not expired
    if (!user.token || user.token !== token || Date.now() > user.tokenExpires) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10), null);
    user.password = hashedPassword;

    // Clear token and expiration data
    user.token = undefined;
    user.tokenExpires = undefined;
    user.otp = undefined; // Clear OTP if needed
    user.otpExpires = undefined; // Clear OTP expiration if needed
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in Reset Password: ", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
