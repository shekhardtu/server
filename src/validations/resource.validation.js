const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createResource = {
  body: Joi.object().keys({
    location: Joi.string().required(),
    description: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().required(),
    contactNumber: Joi.string().required(),
    images: Joi.string().required(),
  }),
};

const getResources = {
  body: Joi.object()
    .keys({
      location: Joi.string().required(),
      description: Joi.string().required(),
      title: Joi.string().required(),
      type: Joi.string().required(),
      contactNumber: Joi.string().required(),
      images: Joi.string().required(),
    })
    .min(1)
};

const getResource = {
  params: Joi.object().keys({
    resourceId: Joi.string().custom(objectId),
  }),
};

const updateResource = {
  params: Joi.object().keys({
    resourceId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      location: Joi.string().required(),
      description: Joi.string().required(),
      title: Joi.string().required(),
      type: Joi.string().required(),
      contactNumber: Joi.string().required(),
      images: Joi.string().required(),
    })
    .min(1),
};

const deleteResource = {
  params: Joi.object().keys({
    resourceId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
};
