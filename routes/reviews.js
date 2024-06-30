const express = require('express');
const router = express.Router({ mergeParams: true }); // MergeParams --> all the params in app.js will be merged with the params in this file (access to the ID in the URL)
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

//Reviews Routes
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;