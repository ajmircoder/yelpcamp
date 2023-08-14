const Review = require('./models/reviewSchema');
const Campground = require('./models/campgroundSchema');

const { reviewSchema, campgroundSchema } = require('./validatorSchema');
const AppError = require('./utils/ExpressError');


const isLogIn = (req, res, next) => {
    // console.log("req.user...", req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed up or log in');
        return res.redirect('/login')

    }
    next();
}
const islogIn = (req, res, next) => {
    if (!req.isAuthenticated()) {  
        req.flash('error', 'you must be signed up or log in');
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
};

const isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const isReviewAuthor = async(req, res, next)=>{
    const {reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        console.log('hi')
        req.flash('error', 'you are not the author');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}


module.exports = { isLogIn, islogIn, storeReturnTo, validateCampground, isAuthor, isReviewAuthor, validateReview };