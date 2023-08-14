if(process.env.NODE_ENV!== "production"){
    require('dotenv').config();
}


const express = require('express');
const mongooes = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsEngine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userSchema');

const campgroundsRoutes = require('./routers/campgrounds');
const reviewsRoutes = require('./routers/review');
const userRoutes = require('./routers/user')

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
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next) =>{
res.locals.currentUser = req.user;
res.locals.varSuccess = req.flash('success');
res.locals.error = req.flash('error')
next();
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

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




