const Joi = require('joi');

const listingsSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.string().allow(""),
        price : Joi.number().required(),
        country : Joi.string().required(),
        location : Joi.string().required()
    }).required()
})

const reviewsSchema = Joi.object({
    review : Joi.object({
        comment : Joi.string().required(),
        rating : Joi.number().required().min(1).max(5)
    }).required()
})

module.exports = { listingsSchema, reviewsSchema };