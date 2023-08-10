const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../validatorSchema');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campgroundSchema');
const Review = require('../models/reviewSchema');
const AppError = require('../utils/ExpressError');
const { islogIn, isReviewAuthor, validateReview } = require('../middleware');


router.post('/', islogIn, validateReview, catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    const reviews = await new Review(req.body.review);
    campgrounds.reviews.push(reviews);
    reviews.author = req.user._id;
    await reviews.save();
    await campgrounds.save();
    req.flash('success', 'Thanks for the review')
    res.redirect(`/campgrounds/${campgrounds._id}`)
}));

router.get('/:reviewId/edit', isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campgrounds = await Campground.findById(id);
    const review = await Review.findById(reviewId);
    res.render('campgrounds/reviewEdit', { campgrounds, review })
}))

router.delete('/:reviewId/delete', isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    res.send({ message: "success" });
}));

router.put('/:reviewId', isReviewAuthor, catchAsync(async (req, res) => {
    const { reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
    res.redirect(`/campgrounds/${req.params.id}`)
}))




module.exports = router;


