var Joi = require('joi');
var user = {
    body: {
        username:Joi.string().required(),
        password: Joi.string().required(),
        fullname:Joi.string().required(),
        country:Joi.string().required(),
    }
}
module.exports = user;