const Review = require('../models/review');
const Campground = require('../models/campground');

//Reviews controllers
module.exports.createReview = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Thank you for your review!')
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // removes from an existing array (reviews[ObjectId]) all instances of a value or values that match the ID
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!')
    res.redirect(`/campgrounds/${id}`)
};