const express = require('express');
const  router  = express.Router({ mergeParams: true});
const { reviewSchema } = require('../validatorSchema');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campgroundSchema');
const Review = require('../models/reviewSchema');
const AppError = require('../utils/ExpressError');


const validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    const reviews = await new Review(req.body.review);
    campgrounds.reviews.push(reviews);
    await reviews.save();
    await campgrounds.save();
    res.redirect(`/campgrounds/${campgrounds._id}`)
}));

router.get('/:reviewId/edit', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    const review = await Review.findById(req.params.reviewId);
    res.render('campgrounds/reviewEdit', { campgrounds, review })
}))

router.delete('/:reviewId/delete', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id);
    await Review.findByIdAndDelete(req.params.reviewId)
    res.send({ message: "success" });
    // res.redirect(`/campgrounds/${campgrounds._id}`)

}));

router.put('/:reviewId', catchAsync(async (req, res) => {
    const { reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
    res.redirect(`/campgrounds/${req.params.id}`)
}))




module.exports = router;