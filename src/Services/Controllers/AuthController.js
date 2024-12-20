"use strict";

const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Otp = require("../models/otp");
const PendingUser = require("../models/pendingUsers")

const { signInSchema, emailSchema, passwordSchema } = require('../../libs/schemaValidation')
const { SendEmail } = require('../../libs/Helper')
const { generateOTP, createNotification } = require('./../../../utills/authUtils')


// const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true })

const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


module.exports.SignIn = async (req, res, next) => {
  try {
    const { email, latitude, longitude, deviceId } = req.body;
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
      !(await bcrypt.compare(req.body.password, user_detail.password))
    ) {
      return res.status(500).json({
        success: false,
        message: "Username or password is incorrect",
      });
    }

    var token = jwt.sign(
      { user_id: user_detail.id, role: user_detail.role },
      process.env.jwt_token_key,
    );

    user_detail.preferenceLatitude = latitude
    user_detail.preferenceLongitude = longitude
    user_detail.deviceId = deviceId
    user_detail.save()


    const userData = {
      id: user_detail._id,
      name: user_detail.name,
      email: user_detail.email,
      role: user_detail.role,
      age: user_detail.age,
      status: user_detail.status,
      phoneNumber: user_detail.phoneNumber,
      deviceId
    };

    const { password, ...userWithoutPassword } = user_detail.toObject();
    return res.json({
      user: userWithoutPassword,
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
    const { name, phoneNumber, password, latitude, longitude, deviceId } = pendingUser;

    console.log('pendingUser.latitude',pendingUser.latitude)
    console.log('pendingUser.longitude',pendingUser.longitude)

    // Create a new user record in the User collection
    const newUser = new User({
      name,
      email,
      password,
      phoneNumber,
      deviceId,
      latitude, longitude,
      preferenceLatitude: pendingUser.latitude,
      preferenceLongitude: pendingUser.longitude,
      isVerified: true, // Mark as verified
    });

    await newUser.save();

    // Remove the user from PendingUser collection
    await PendingUser.deleteOne({ email });

    // Generate JWT token
    const token = jwt.sign(
      { user_id: newUser._id, role: "user" },
      process.env.jwt_token_key,
    );

    return res.json({
      user: newUser,
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


module.exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { error } = emailSchema.validate({ email });
    if (error) {
      return res.status(400).json({ error: error.details[0].message, success: false, });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false, });
    }

    // const isOtpSend = await Otp.findOne({ email });
    // if (isOtpSend) {
    //   return res.status(404).json({ message: "Otp has been already sent to your registred email address", success: false, });
    // }

    const otp = generateOTP();
    console.log("Generated OTP:", otp); // For debugging

    // Update OTP and expiration time
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpires: new Date(Date.now() + 2 * 60 * 1000),
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update OTP", success: false, });
    }



    let mail_options = {
      to: email,
      subject: 'Your OTP Code',
      text: `Your forget password verification OTP code is ${otp}. It will expire in 2 minutes.`,
      from: `${process.env.MAIL_USERNAME} <${process.env.MAIL_FROM_ADDRESS}>`,
    };

    await SendEmail(mail_options)
      .then((info) => {
        console.log("Nodemailer Email sent ---------- ", info.response);
      })
      .catch((error) => {
        console.log("Nodemailer error ---------- ", error);
      });

    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      // If it exists, update the OTP and expiration time
      existingOtp.otp = otp;
      existingOtp.otpExpires = new Date(Date.now() + 2 * 60 * 1000); // Current time + 2 minutes
      await existingOtp.save(); // Save the updated record
      console.log('OTP updated successfully.');
    } else {
      // If it doesn't exist, create a new OTP record
      const newOtp = await Otp.create({
        email,
        otp,
        otpExpires: new Date(Date.now() + 2 * 60 * 1000), // Current time + 2 minutes
      });
      console.log('New OTP created successfully.');
    }

    return res.status(200).json({ message: "OTP has been sent to your email", success: true, });
  } catch (error) {
    console.error("Error in Forgot Password: ", error);
    return res.status(500).json({ message: "Internal Server Error", success: false, });
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

    var token = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.jwt_token_key,
    );

    // OTP is correct, finalize registration
    user.token = token
    user.tokenExpires = new Date(Date.now() + 2 * 60 * 1000)
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true; // Set user as verified
    await user.save();



    return res.json({
      status: 200,
      success: true,
      token,
      message: "Your have been verified successfully",
    });

  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during OTP verification.",
    });
  }
};


module.exports.verifyEmail = async (req, res, next) => {
  console.log("-----sendEmail------");
  try {
    let { email } = req.body;
    const { error } = emailSchema.validate({ email });

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
    // Generate and send OTP
    const otp = generateOTP();

    let mail_options = {
      to: email,
      subject: 'Your OTP Code',
      text: `Your Email verification OTP code is ${otp}. It will expire in 2 minutes.`,
      from: `${process.env.MAIL_USERNAME} <${process.env.MAIL_FROM_ADDRESS}>`,
    };

    await SendEmail(mail_options)
      .then((info) => {
        console.log("Nodemailer Email sent ---------- ", info.response);
      })
      .catch((error) => {
        console.log("Nodemailer error ---------- ", error);
      });

    const userEmail = await Otp.create({
      email,
      otp,
      otpExpires: Date.now() + 2 * 60 * 1000, // OTP valid for 10 minutes
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

module.exports.verifyEmailOtp = async (req, res) => {
  console.log("-----verifyEmailOtp------");
  const { email, otp } = req.body;

  try {
    // Check if the user exists in the PendingUser collection
    const isOtpExists = await Otp.findOne({ email });

    if (!isOtpExists) {
      return res.status(400).json({
        success: false,
        message: "regenerate OTP",
      });
    }

    // Check if OTP matches and if it has expired
    if (isOtpExists.otp !== otp || isOtpExists.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is incorrect or has expired.",
      });
    }

    // Remove the user from PendingUser collection
    await Otp.deleteOne({ email });


    return res.json({
      status: 200,
      success: true,
      message: "Your Email has been verified successfully.",
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({
      success: false,
      message: `An error occurred during OTP verification.${error}`,
    });
  }
}

module.exports.resendOtp = async (req, res, next) => {
  console.log("-----resendOtp------");
  try {
    const { email } = req.body;

    // Check if the user is in the PendingUser collection
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found for this email.",
      });
    }

    // Check if the existing OTP is still valid
    if (pendingUser.otpExpires > Date.now()) {
      return res.status(400).json({
        success: false,
        message: "An OTP was recently sent. Please wait before requesting a new one.",
      });
    }

    // Generate and send OTP
    const otp = generateOTP();

    await client.messages.create({
      body: `Your OTP for account verification is ${otp}. It is valid for 2 minutes. Please do not share it with anyone.`,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${pendingUser.phoneNumber}`,
    }).then(message => console.log(`OTP sent. SID: ${message.sid}`));

    // Update OTP and expiration time in PendingUser collection
    await PendingUser.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpires: Date.now() + 2 * 60 * 1000, // 2 minutes expiration
      },
      { new: true } // Return the updated document
    );

    const newUser = await User.findOne({ email })


    return res.json({
      user: newUser,
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
    console.log('user', user)

    console.log('!user.token', !user.token)
    console.log('user.token !== token', user.token !== token)
    console.log('Date.now() > user.tokenExpires', Date.now() > user.tokenExpires)



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


module.exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, } = req.body;

    if (!oldPassword) {
      return res.status(404).json({ success: false, message: "Please provide your current password to proceed" });
    }

    // Validate new password
    const { error } = passwordSchema.validate({ newPassword });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User  not found" });
    }

    // Check if the old password is correct
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10), null);
    user.password = hashedPassword;
    await user.save();

    console.log('user', user)
    const notificationData = {
      recipient: user._id,
      sender: user._id,
      message: 'Your password has been changed sucessfully',
      type: 'password',
    };

    createNotification(notificationData)
      .then(notification => console.log('Notification created:', notificationData))
      .catch(error => console.error('Error:', error));


    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in Change Password: ", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.changeForgetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate new password
    const { error } = passwordSchema.validate({ newPassword });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    // Find the user by ID
    const user = await User.findOne({ email });

    console.log('user', user)

    if (!user) {
      return res.status(404).json({ success: false, message: "User  not found" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10), null);
    user.password = hashedPassword;

    await user.save();



    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in Change Password: ", error);
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