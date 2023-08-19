const mongooes = require('mongoose');
const Review = require('./reviewSchema');
const { Schema } = mongooes

const ImageSchema = new Schema({
        url:String,
        filename: String
});
ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    rank: {
        type: String,
    },
    state: {
        type: String,
    },
    geometry: {
        type: {
            type: String, 
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
});


CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
var autoPopulateLead = function (next) {
    this.populate('author');
    next();
};

CampgroundSchema.
    pre('findOne', autoPopulateLead).
    pre('findById', autoPopulateLead);

module.exports = mongooes.model('Campground', CampgroundSchema);