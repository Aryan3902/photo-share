const express = require("express")
const {check} = require("express-validator")
const checkAuth = require("../middleware/auth-check")
const router = express.Router();

const placesController = require("../controllers/places-controllers");
const fileUpload = require("../middleware/file-upload");

router.get("/user/:uid", placesController.getUserPlacesbyId)

router.get("/:pid", placesController.getPlacebyId)

// Middleware to check for a valid incoming token and stop the url checking from below here if a token doesn't exist
router.use(checkAuth)

router.post("/",fileUpload.single('image'),[check('name').not().isEmpty(), check('caption').not().isEmpty()], placesController.createPlace)

router.post("/:pid/upvote", placesController.upvotePlace)

router.patch("/:pid",[check('name').not().isEmpty(), check('caption').not().isEmpty()], placesController.updatePlace)

router.delete("/:pid", placesController.deletePlace)

module.exports = router;