"use strict";

const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Otp = require("../models/otp");
const PendingUser = require("../models/pendingUsers")

const { signInSchema, emailSchema, passwordSchema } = require('../../libs/schemaValidation')
const { SendEmail } = require('../../libs/Helper')
const { generateOTP } = require('./../../../utills/authUtils')


// const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true })

const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


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
      { user_id: user_detail.id, role: user_detail.role },
      process.env.jwt_token_key,
    );

    const userData = {
      id: user_detail._id,
      name: user_detail.name,
      email: user_detail.email,
      role: user_detail.role,
      age: user_detail.age,
      status: user_detail.status,
      phoneNumber: user_detail.phoneNumber
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
    // Check if the user exists in the PendingUser collection
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found or registration not initiated.",
      });
    }

    // Check if OTP matches and if it has expired
    if (pendingUser.otp !== otp || pendingUser.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is incorrect or has expired.",
      });
    }

    // OTP is correct, move the pending user to the main User collection
    const { name, phoneNumber, password } = pendingUser;

    // Create a new user record in the User collection
    const newUser = new User({
      name,
      email,
      password,
      phoneNumber,
      isVerified: true, // Mark as verified
    });

    await newUser.save();

    // Remove the user from PendingUser collection
    await PendingUser.deleteOne({ email });

    // Generate JWT token
    const token = jwt.sign(
      { user_id: newUser._id, role: "user" },
      process.env.jwt_token_key,
      { expiresIn: "8h" }
    );

    return res.json({
      status: 200,
      success: true,
      token,
      message: "Your account has been verified successfully.",
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during OTP verification.",
    });
  }
};

module.exports.verifyForgotOtp = async (req, res) => {
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
    console.log("user.phoneNumber:", user.phoneNumber);

    /*
        await client.messages.create({
          body: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
          from: '+13345186584',
          to: user.phoneNumber,
        });*/

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

    // Check if the user is in the PendingUser collection
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found for this email.",
      });
    }

    // Generate and send OTP
    const otp = generateOTP();

    await client.messages.create({
      body: `Your OTP for password reset is ${otp}. It is valid for 10 minutes. Please do not share it with anyone.`,
      from: '+13345186584', // Replace with your actual Twilio phone number
      to: pendingUser.phoneNumber,
    });

    // Update OTP and expiration time in PendingUser collection
    const updatedPendingUser = await PendingUser.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes expiration
      },
      { new: true } // Return the updated document
    );

    return res.json({
      status: 200,
      success: true,
      message: "OTP has been resent to your phone number.",
    });
  } catch (error) {
    console.error("Error in resendOtp:", error);
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

module.exports.resetAdminPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    // Verify the reset token
    const { error } = passwordSchema.validate({ newPassword });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const user = await User.findById(req.user.id); // Get the user based on the ID in the token

    console.log('user', user)
    console.log('req.user.id', req.user.id)

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token or user not found.' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      user: user,
      success: true,
      message: 'Password has been reset successfully.',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while resetting the password.',
    });
  }
};

const otps = {};

module.exports.sendOTP = async (req, res, next) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

  // Store OTP in memory
  otps[phoneNumber] = otp;

  client.messages
    .create({
      body: 'OTP sent successfully',
      from: '+13345186584',
      to: phoneNumber
    })
    .then(message => console.log(message.sid));
};

module.exports.verifyOTP = async (req, res, next) => {
  const { countryCode, phoneNumber, otp } = req.body;
  try {
    const verifiedResponse = await client.verify
      .services(TWILIO_ACCOUNT_SID)
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });
    res.status(200).send(`OTP verified successfully!: ${JSON.stringify(verifiedResponse)}`)
  }
  catch (error) {
    res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
  }
}

// module.exports.sendOTP = async (req, res, next) => {
//   const { countryCode, phoneNumber } = req.body;
//   try {
//     const otpResponse = await client.verify
//       .services(TWILIO_ACCOUNT_SID)
//       .verifications.create({
//         to: `+${countryCode}${phoneNumber}`, channel: "sms",
//       });
//     return res.status(200).send(`OTP send successfully!: ${JSON.stringify(otpResponse)}`);
//   } catch (error) {
//     return res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
//   }
// };