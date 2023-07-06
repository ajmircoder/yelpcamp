const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
    rank : String,
    state: String
});

module.exports = mongooes.model('Campground', CampgroundSchema);