const express = require('express');
const mongooes = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsEngine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/ExpressError');
const campgrounds = require('./routers/campgrounds');
const reviews = require('./routers/review');
const Campground = require('./models/campgroundSchema');
const session = require('express-session')

mongooes.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log("openn mongooesss")
    }).catch((e) => {
        console.log(`oh no error ${e}`)
    })

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsEngine);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig ={
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 *60 * 60 * 24 * 7,
        maxAge: 1000 *60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

const port = process.env.port || 8000;

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', catchAsync(async (req, res, next) => {
    next(new AppError('Oh Boy Page Not Found', 404))
}))

app.use((err, req, res, next) => {
    const { statusCode = 404, } = err;
    if (!err.message) err.message = 'oh no something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log(`connection open on port ${port}`)
})




