const mongooes = require('mongoose');
const { Schema } = mongooes;

const reviewSchema = new Schema({
    body: String,
    rating: Number
});

const Review = mongooes.model('Review', reviewSchema);

const reviewOne = new Review({
    body:"hey there",
    rating: 9
})

module.exports = Review;
// reviewOne.save();