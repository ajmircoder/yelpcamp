const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../validatorSchema');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campgroundSchema');
const AppError = require('../utils/ExpressError');
const {isLogIn} = require('../middleware')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
};

router.get('/makecampground', async (req, res) => {
    res.render('home')
});

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/new', isLogIn , async (req, res) => {
        res.render('campgrounds/new')
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new AppError('invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    if (!campgrounds) {
        req.flash('error', 'campground not found');
        return res.redirect('/campgrounds')
    }
    const allReviews = ((await campgrounds.populate('reviews')).reviews);
    res.render('campgrounds/show', { campgrounds, allReviews });
}));

router.get('/:id/edit',isLogIn, catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    if (!campgrounds) {
        req.flash('error', 'campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campgrounds })
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'You update successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'deleted successfully');
    res.redirect('/campgrounds/');
}));

module.exports = router;