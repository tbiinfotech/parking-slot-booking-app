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
const ListingController = require('./Controllers/listingController')
const BookingController=require('./Controllers/BookingController')

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


/*** Space listing/creating ***/

router.post(
  "/api/listings",
  authorize(),
  (req, res, next) => {
    upload.array('mediaUrl', 4)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  ListingController.createListing
);

router.get("/api/get-user-addresses", authorize(), ListingController.getUserAddresses);
router.get("/api/addresses", authorize(), ListingController.getAllAddresses);
router.get("/api/addresses/:listingId", authorize(), ListingController.getAddressByListId);




router.post('/api/favorites', authorize(), ListingController.addToFavorites);
router.get('/api/favorites', authorize(), ListingController.getFavoriteAddresses);
router.put('/api/listings/status/:listingId', authorize(), ListingController.updateListingStatus);

// router.post('/api/listings/:listingId', authorize(), ListingController.editListing);


router.delete('/api/listings/:listingId', authorize(), ListingController.removeListing);


router.post(
  "/api/listings/:listingId",
  authorize(),
  (req, res, next) => {
    upload.array('mediaUrl', 4)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  ListingController.editListing
);


/*** Booking Controller ***/

router.post('/api/booking', authorize(), ListingController.addToFavorites);


/*** Notification controller ***/





module.exports = router;
