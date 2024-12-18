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
const BookingController = require('./Controllers/BookingController')
const PaymentController = require('./Controllers/PaymentController')
const TransactionController = require('./Controllers/TransactionController')
const StripeKeysController = require('./Controllers/StripeKyeController')
const NotificationController = require('./Controllers/NotificationController')


/*** Auth Routers ***/
router.post("/api/sign-in", AuthController.SignIn);
router.post("/api/forget-password", AuthController.ForgotPassword);
// router.post("/api/verify-otp", AuthController.verifyOtp);

router.post("/api/reset-password", AuthController.ResetPassword);
router.post("/api/resend-otp", AuthController.resendOtp);
router.post("/api/reset-admin-password", authorize(), AuthController.resetAdminPassword);
router.post("/api/verify-email", AuthController.verifyEmail)
router.post("/api/verify-email-otp", AuthController.verifyEmailOtp)
router.post("/api/change-password", authorize(), AuthController.changePassword)


/*twillio sms route*/
router.post("/api/send-otp", AuthController.sendOTP)
router.post("/api/verify-otp", AuthController.verifyOtp)
router.post("/api/verify-forget-otp", AuthController.verifyForgotOtp)
router.post("/api/change-forget-password", AuthController.changeForgetPassword)

/*** Admin ***/
router.post("/api/create-user", UserController.createUser);
router.get("/api/get-user", authorize(), UserController.getUser);
router.get('/api/get-users', authorize(), UserController.getUsersWithPagination);

router.get("/api/users/:id", authorize(), UserController.getUserById);


router.post(
  "/api/update-user/:id",
  authorize(),
  UserController.updateUser
);


router.post("/api/update-preference", authorize(), UserController.updatePreference)
router.post("/api/update-notification", authorize(), UserController.updateNotification)

router.delete(
  "/api/delete-user/:id",
  authorize(),
  UserController.deleteUser
);

router.post(
  "/api/delete-users",
  UserController.deleteUsersWithPagination
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
router.get("/api/addresses-with-pagination", authorize(), ListingController.getAllAddressesWithPaginagtion);
router.get("/api/listings/home", authorize(), ListingController.getListingsWithinRadius);
router.get("/api/address-user-location", authorize(), ListingController.getAddressByUserLocation);

router.get("/api/filter-listings", authorize(), ListingController.getFilterListing);

router.post('/api/favorites', authorize(), ListingController.addToFavorites);
router.get('/api/favorites', authorize(), ListingController.getFavoriteAddresses);
router.put('/api/listings/status/:listingId', authorize(), ListingController.updateListingStatus);

// router.post('/api/listings/:listingId', authorize(), ListingController.editListing);


router.delete('/api/listings/:listingId', authorize(), ListingController.removeListing);
router.post('/api/deleteListing', authorize(), ListingController.deleteAllListing);

router.post(
  "/api/listings/:id",
  authorize(),
  (req, res, next) => {
    upload.array('mediaUrl', 8)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  ListingController.updateListing
);


/*** Booking Controller ***/

router.post('/api/booking', authorize(), BookingController.createBooking);

/*** Payment controller ***/
router.post('/api/create-connected-account', authorize(), PaymentController.createConnectedAccount);

router.post('/api/booking-webhook', express.raw({ type: 'application/json' }), BookingController.webhook)

router.get('/api/test', BookingController.test)

router.get('/api/transactions', TransactionController.getAllTransactions)
router.post('/api/transactions', TransactionController.createTransaction)
router.post('/api/save-stripe-keys', StripeKeysController.saveStripeKeys);


/*** Notification controller ***/
router.get('/api/check-notification', authorize(), NotificationController.checkNotification)
router.post('/api/send-notification', authorize(), NotificationController.sendPushNotificationNew )


module.exports = router;
