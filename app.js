const express = require('express');
const Campground = require('./models/campground')
const mongooes = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsEngine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./validatorSchema');
const Review  = require('./models/review');



mongooes.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log("openn mongooesss")
    }).catch((e) => {
        console.log(`oh no error ${e}`)
    })
// const db = mongooes.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", ()=>{
//     console.log("Database connected")
// })

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsEngine)

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(morgan('tiny'))

const port = process.env.port || 8000;

const validateCampground = (req, res, next)=>{
    
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else{
        next();
    }
};
const validateReview = (req, res, next)=>{
    
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else{
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/makecampground', async (req, res) => {
    res.render('home')
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new')
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    if(!req.body.campground) throw new AppError('invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    const allReviews = ((await campgrounds.populate('reviews')).reviews);
    res.render('campgrounds/show', { campgrounds, allReviews })
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    const reviews = await new Review(req.body.review);
    campgrounds.reviews.push(reviews);
    await reviews.save();
    await campgrounds.save();
    res.redirect(`/campgrounds/${campgrounds._id}`)
}));


app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campgrounds })
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds/')
}));

app.all('*', catchAsync(async (req, res, next) => {
    next(new AppError('Oh Boy Page Not Found', 404))
}))

app.use((err, req, res, next) => {
    const{statusCode = 404,} = err;
    if(!err.message) err.message = 'oh no something went wrong'
    res.status(statusCode).render('error', {err})
})

app.listen(port, () => {
    console.log(`connection open on port ${port}`)
})