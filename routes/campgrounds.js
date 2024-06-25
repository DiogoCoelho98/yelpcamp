const express = require('express');
const router = express.Router();
const multer = require('multer'); //handles multipart/form-data, uploading files. Is configured to store uploaded files in the 'uploads/' directory.
const { storage } = require('../cloudinary'); // dont need to complete the full path, because node automatically looks for an index.js file
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, validateObjectId, isAuthor } = require('../middleware');


//Campground Routes

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.newRenderForm);

router.route('/:id')
    .get(validateObjectId, catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, validateObjectId, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, validateObjectId, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, validateObjectId, isAuthor, catchAsync(campgrounds.editRenderForm));

module.exports = router;