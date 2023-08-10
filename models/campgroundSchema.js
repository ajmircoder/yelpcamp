const mongooes = require('mongoose');
const Review = require('./reviewSchema');
const { Schema } = mongooes

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
    img: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
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