const joi = require('joi');

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title : joi.string().required(),
        price: joi.number().min(0),
        img : joi.string().required(),
        location : joi.string().required(),
        description : joi.string().required(),
        state : joi.string().required()
    }).required()
});