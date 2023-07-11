const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    rank : String,
    state: String,
    img: String
});

module.exports = mongooes.model('Campground', CampgroundSchema);