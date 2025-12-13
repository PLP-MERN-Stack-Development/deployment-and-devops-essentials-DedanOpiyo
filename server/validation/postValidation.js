// validation/postValidation.js
const Joi = require('joi');

exports.createPostSchema = Joi.object({
  title: Joi.string().max(100).required(),
  content: Joi.string().required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional(),
});
