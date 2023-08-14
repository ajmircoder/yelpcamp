const Campground = require('../models/campgroundSchema');
const Review = require('../models/reviewSchema');

module.exports.makeRiview = async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    const review = new Review(req.body.Review);
    campgrounds.reviews.push(review);
    review.author = req.user._id;
    await review.save()
    await campgrounds.save();
    req.flash('success', 'Thanks for the review');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.reviewEditForm = async (req, res) => {
    const { id, reviewId } = req.params;
    const campgrounds = await Campground.findById(id);
    const review = await Review.findById(reviewId);
    res.render('campgrounds/reviewEdit', { campgrounds, review })
}

module.exports.destroyReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.send({ message: "success" });
    
}

module.exports.editReview = async (req, res) => {
    const { reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
    res.redirect(`/campgrounds/${req.params.id}`)
}