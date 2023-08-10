const mongooes = require('mongoose');
const { Schema } = mongooes;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


var autoPopulateLead = function (next) {
    this.populate('author');
    next();
};

reviewSchema.
    pre('findOne', autoPopulateLead).
    pre('findById', autoPopulateLead);

const Review = mongooes.model('Review', reviewSchema);

module.exports = Review;

