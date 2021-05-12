const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const resourceSchema = mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: String,
      required: false,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    resourceStatus: {
      type: String,
      required: true,
      trim: true,
      default: 'unPublished',
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
resourceSchema.plugin(toJSON);
resourceSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The resource's email
 * @param {ObjectId} [excludeResourceId] - The id of the resource to be excluded
 * @returns {Promise<boolean>}
 */
resourceSchema.statics.isEmailTaken = async function (email, excludeResourceId) {
  const resource = await this.findOne({ email, _id: { $ne: excludeResourceId } });
  return !!resource;
};

/**
 * Check if password matches the resource's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
resourceSchema.methods.isPasswordMatch = async function (password) {
  const resource = this;
  return bcrypt.compare(password, resource.password);
};

resourceSchema.pre('save', async function (next) {
  const resource = this;
  if (resource.isModified('password')) {
    resource.password = await bcrypt.hash(resource.password, 8);
  }
  next();
});

/**
 * @typedef Resource
 */
const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
