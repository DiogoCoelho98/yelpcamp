const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, validateObjectId, isAuthor } = require('../middleware');
const Campground = require('../models/campground')

//Campgrounds Routes
router.route('/')
    .get(catchAsync(async (req, res, next) => {
        const page = parseInt(req.query.page) || 1; 
        const pageSize = 10; 
        const skip = (page - 1) * pageSize;

        try {
            const totalCampgrounds = await Campground.countDocuments();
            const campgrounds = await Campground.find()
                .skip(skip)
                .limit(pageSize);

            res.render('campgrounds/index', {
                campgrounds,
                currentPage: page,
                totalPages: Math.ceil(totalCampgrounds / pageSize)
            });
        } catch (err) {
            next(err);
        }
    }))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(async (req, res, next) => {
        try {
            await campgrounds.createCampground(req, res);
        } catch (err) {
            next(err);
        }
    }));

router.get('/new', isLoggedIn, campgrounds.newRenderForm);

router.route('/:id')
    .get(validateObjectId, catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, validateObjectId, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, validateObjectId, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, validateObjectId, isAuthor, catchAsync(campgrounds.editRenderForm));

module.exports = router;