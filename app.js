// const { log } = require('console');
const express = require('express');
const Campground = require('./models/campground')
const mongooes = require('mongoose');
const path = require('path')
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsEngine = require('ejs-mate')


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

const port = process.env.port || 8000;


app.get('/', (req, res) => {
    res.render('home')
});

app.get('/makecampground', async (req, res) => {
    res.render('home')
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new')
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    try {
        const campgrounds = await Campground.findById(req.params.id);
        res.render('campgrounds/show', { campgrounds })
    } catch (e) {
        console.log('error on 59')
    }
});


app.get('/campgrounds/:id/edit', async (req, res) => {
    try {
        const campgrounds = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campgrounds })
    } catch (e) {
        console.log("error 64")
    }
});

app.put('/campgrounds/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        res.redirect(`/campgrounds/${campground._id}`)
    } catch (e) {
        console.log(e);
    }

});

app.delete('/campgrounds/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds/')
    } catch (e) {
        console.log(e)
    }
});

app.listen(port, () => {
    console.log(`connection open on port ${port}`)
})