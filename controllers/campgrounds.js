const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campgroundSchema');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.newCampgroundForm = async (req, res) => {
    res.render('campgrounds/new')
}

module.exports.makeNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f =>({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showOneCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: "author"
        }
    });
    if (!campground) {
        req.flash('error', 'campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground, allReviews: campground.reviews, author: campground.author });
}

module.exports.editCampgroundForm = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds) {
        req.flash('error', 'campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campgrounds })
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
   let campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
   const imgs =req.files.map(f =>({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: {filename: { $in: req.body.deleteImages } } } })
        await campground.save();
    }
    req.flash('success', 'You update successfully');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.destroyCamground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'deleted successfully');
    res.redirect('/campgrounds');
}
// module.exports = { newCampgroundForm, makeNewCampground, oneCampground}
