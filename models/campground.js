const mongooes = require('mongoose');
const Schema = mongooes.Schema;

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
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

module.exports = mongooes.model('Campground', CampgroundSchema);