const joi = require('joi');

module.exports.campgroundSchema = joi.object({
    camp: joi.object({
        title: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        // image: joi.string().required(),
    }).required(),
    deleteImages: joi.array()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.string().required(),
        body: joi.string().required()
    }).required()
})
