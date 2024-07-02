const Joi = require('joi');
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ statuscode: 400, error: true, success: "false", message: errorMessage });
        }
        next()
    };
};

const registerSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required().min(6),
    isAdmin:Joi.allow('',null)
});
const CP = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price:Joi.required(),
    stock:Joi.required(),
    
});

const loginSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
});

const createblog = Joi.object({
    titel: Joi.string().required(),
    description: Joi.string().required(),
    author: Joi.string().required(),
    state: Joi.required()
})
module.exports = {
    validateRequest,
    registerSchema,
    loginSchema,
    createblog,
    CP
};

