if(process.env.NODE_ENV!== "production"){
    require('dotenv').config();
}else{
    require('dotenv').config({path: ".env.production"});
};


const express = require('express');
const mongooes = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsEngine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userSchema');
const helmet = require('helmet');

const campgroundsRoutes = require('./routers/campgrounds');
const reviewsRoutes = require('./routers/review');
const userRoutes = require('./routers/user');

const url = process.env.MONGO_URI;

mongooes.connect(url)
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
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvtmj0rui/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


const store = MongoStore.create({
    mongoUrl: url,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

const sessionConfig ={
    store,
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




