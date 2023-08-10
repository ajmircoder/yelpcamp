const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../validatorSchema');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campgroundSchema');
const AppError = require('../utils/ExpressError');
const { isLogIn, validateCampground, isAuthor } = require('../middleware');


router.get('/makecampground', async (req, res) => {
    res.render('home')
});

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/new', isLogIn, async (req, res) => {
    res.render('campgrounds/new')
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new AppError('invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:"author"
        }
    });
    if (!campgrounds) {
        req.flash('error', 'campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campgrounds, allReviews: campgrounds.reviews, author: campgrounds.author });
}));

router.get('/:id/edit', isLogIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    if (!campgrounds) {
        req.flash('error', 'campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campgrounds })
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'You update successfully');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id/delete', isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'deleted successfully');
    res.redirect('/campgrounds/');
}));

module.exports = router;