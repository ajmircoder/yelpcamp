const mongooes = require('mongoose');
const Review = require('./reviewSchema');
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

CampgroundSchema.post('findOneAndDelete', async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongooes.model('Campground', CampgroundSchema);