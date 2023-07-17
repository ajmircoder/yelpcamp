const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String,
        // required: true
    },
    price: {
        type:Number,
        // required: true
    },
    description: {
        type:String,
        // required: true
    },
    location:{
        type:String,
        // required: true
    },
    rank :{
        type:String,
        // required: true
    },
    state: {
        type:String,
        // required: true
    },
    img: {
        type:String,
        // required: true
    }
});

module.exports = mongooes.model('Campground', CampgroundSchema);