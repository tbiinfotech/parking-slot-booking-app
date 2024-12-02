const bcrypt = require("bcrypt");
const User = require("../models/users");
const Listing = require("../models/Listing");
const PendingUser = require("../models/pendingUsers")

const Joi = require('joi');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const { userSchema, updateUserSchema, updateProfileSchema } = require('../../libs/schemaValidation')
const { generateOTP } = require('./../../../utills/authUtils')
const errorHandling = require('../../libs/errorHandling')
const mongoose = require("mongoose");

const { SendEmail } = require('../../libs/Helper')

const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports.getUser = async (req, res, next) => {
  try {
    const users = await User.find({
      email: { $ne: 'admin@gmail.com' },
      isDeleted: { $ne: true }  // Exclude users marked as deleted
    }).sort({ createdAt: -1 }).skip(skip).limit(limit);

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

module.exports.getUsersWithPagination = async (req, res, next) => {
  console.log('getUsersWithPagination')
  try {
    const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit;

    // Define your filter criteria
    const filter = {
      email: { $ne: 'admin@gmail.com' },
      isDeleted: { $ne: true },  // Exclude users marked as deleted
    };

    // Get the data with pagination and filter applied
    const users = await User.find(filter)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .skip(skip)
      .limit(limit);

    // Optionally, get the total count for pagination info
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    return res.json({
      status: 200,

      data: {
        records: users, pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      success: true,
      message: "Data found",

    });
  } catch (error) {
    console.error("Error while trying to get data-------", error);
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
    let { name, email, password, phoneNumber } = req.body;
    const { error } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Check if the email already exists in the main Users collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please try a different email.",
      });
    }

    // Check if the email is already in the PendingUser collection
    const existingPendingUser = await PendingUser.findOne({ email });
    if (existingPendingUser) {
      // Remove expired pending user records
      if (existingPendingUser.otpExpires < Date.now()) {
        await PendingUser.deleteOne({ email });
      } else {
        return res.status(400).json({
          success: false,
          message: "OTP already sent. Please verify the OTP or wait for it to expire.",
        });
      }
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Generate and send OTP
    const otp = generateOTP(); // Assume this generates a 6-digit OTP
    /*  await client.messages.create({
        body: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        from: '+13345186584',
        to: phoneNumber,
      });*/
    // await client.messages.create({
    //   body: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    //   from: 'whatsapp:+14155238886',
    //   to: `whatsapp:${phoneNumber}`
    // });


    client.messages.create({
      body: `Your OTP is ${otp} It will expire in 2 minutes`,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${phoneNumber}`
    }).then(message => console.log(message.sid))
    // client.messages.create({
    //   body: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    //   from: 'whatsapp:+14155238886',
    //   to: `whatsapp:${phoneNumber}`
    // }).then(message => console.log("whatsup message id:", message.sid)).done();

    // Save user data in the PendingUser collection
    const pendingUser = await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      otp,
      otpExpires: Date.now() + 2 * 60 * 1000, // OTP valid for 10 minutes
    });

    return res.status(200).json({
      success: true,
      message: "OTP has been sent to your phone number.",
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


module.exports.updatePreference = async (req, res, next) => {
  console.log("updatePreference")
  try {
    let { type } = req.body;
    console.log('req.user.id', req.user.id)

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User does not exist!",
      });
    }

    user.preference = type
    user.save();

    return res.json({
      user: user,
      status: 200,
      success: true,
      message: "Preference updated",
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

module.exports.updateNotification = async (req, res, next) => {
  console.log("updateNotification")
  try {
    let { status } = req.body;
    console.log('req.user.id', req.user.id)

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User does not exist!",
      });
    }

    user.pushNotification = status
    user.save();

    return res.json({
      user: user,
      status: 200,
      success: true,
      message: "Notification updated",
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
    const lists = await Listing.find({ owner: id });

    if (user) {
      // Update user to mark as deleted
      user.isDeleted = true;
      await user.save();

      return res.json({
        status: 200,
        success: true,
        message: "User deleted successfully.",
      });
    } else {
      return res.send({
        status: 400,
        success: false,
        message: "User does not exist!",
      });
    }
  } catch (error) {
    console.log("Error while trying to update data-------", error);
    return res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};



module.exports.deleteUsersWithPagination = async (req, res, next) => {
  try {
    const { userIds } = req.body;  // Array of user IDs to delete
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.json({
        status: 400,
        success: false,
        message: "No user IDs provided",
      });
    }

    // Mark users as deleted
    await User.updateMany(
      { _id: { $in: userIds }, email: { $ne: 'admin@gmail.com' } },
      { $set: { isDeleted: true } }
    );

    // Define filter to exclude deleted users and the admin email
    const filter = {
      email: { $ne: 'admin@gmail.com' },
      isDeleted: { $ne: true },
    };

    // Fetch users with updated filter and pagination
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit);

    // Get the total count for pagination info
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    return res.json({
      status: 200,
      data: {
        records: users,
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      success: true,
      message: "Users deleted and data refreshed",
    });
  } catch (error) {
    console.error("Error while trying to delete users and fetch data:", error);
    return res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};



