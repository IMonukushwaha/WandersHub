const Joi = require('joi');

const listingsSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        price : Joi.number().required(),
        country : Joi.string().required(),
        location : Joi.string().required()
    }).required()
})

module.exports = listingsSchema;
