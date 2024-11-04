const express = require("express");
const router = express.Router();
const upload = require("../libs/uploadConfig"); // Import the multer configuration
const uploadStory = require("../libs/uploadStoryConfig");
const multerErrorHandler = require("../libs/multerErrorHandler"); // Import the multer error handler

/*** Middleware ***/
const authorize = require("../Middleware/authorize");

/*** Application Controllers ***/
const AuthController = require("./Controllers/AuthController");
const UserController = require("./Controllers/UserController");


/*** Auth Routers ***/
router.post("/api/sign-in", AuthController.SignIn);
router.post("/api/forget-password", AuthController.ForgotPassword);
router.post("/api/verify-otp", AuthController.verifyOtp);

router.post("/api/reset-password", AuthController.ResetPassword);
router.post("/api/resend-otp", AuthController.resendOtp);


/*** Admin ***/
router.post("/api/create-user", UserController.createUser);
router.get("/api/get-user", authorize(), UserController.getUser);
router.get("/api/users/:id", authorize(), UserController.getUserById);

router.post(
  "/api/update-user/:id",
  authorize(),
  UserController.updateUser
);
router.delete(
  "/api/delete-user/:id",
  authorize(),
  UserController.deleteUser
);




/*** Notification controller ***/





module.exports = router;
