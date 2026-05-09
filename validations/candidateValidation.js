const joi = require("joi");


exports.candidateSchema = joi.object({
    name: joi.string().min(2).required().messages({
        "string.empty": "name is required",
        "string.min": "Name must be at least 2 characters"
    }),

    email: joi.string().email().required().messages({
        "string.email": "invalid email",
        "string.empty": "Email is required"
    }),

    skills: joi.string().allow("").optional()
});