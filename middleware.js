const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./Schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');


//USER MIDDLEWARES
//Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
//Middleware to redirect the user
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//CAMPGROUND MIDDLEWARES
//Middleware to validate campground data in the request body, Joi schema
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// Middleware to validate ObjectId
module.exports.validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Campground does not exist!');
        return res.redirect('/campgrounds');
    }
    next();
};

// Middleware to check the author of the campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

//REVIEWS MIDDLEWARE
//Middleware to validate the review req.body, Joi Schema
module.exports.validateReview = (req, res, next) => { 
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};

//Middleware to check the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}