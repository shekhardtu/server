const httpStatus = require('http-status');
const { Resource } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a resource
 * @param {Object} resourceBody
 * @returns {Promise<Resource>}
 */
const createResource = async (resourceBody) => {
  // if (await Resource.isEmailTaken(resourceBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  const resource = await Resource.create(resourceBody);
  return resource;
};

/**
 * Query for resources
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getResources = async (options) => {
  const resources = await Resource.find({}, `location type id createdBy`);
  return resources;
};

/**
 * Get resource by id
 * @param {ObjectId} id
 * @returns {Promise<Resource>}
 */
const getResourceById = async (id) => {
  return Resource.findById(id, 'location description title type images updatedAt');
};

/**
 * Get resource by email
 * @param {string} email
 * @returns {Promise<Resource>}
 */
const getResourceByEmail = async (email) => {
  return Resource.findOne({ email });
};

/**
 * Update resource by id
 * @param {ObjectId} resourceId
 * @param {Object} updateBody
 * @returns {Promise<Resource>}
 */
const updateResourceById = async (resourceId, updateBody) => {
  const resource = await getResourceById(resourceId);
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  if (updateBody.email && (await Resource.isEmailTaken(updateBody.email, resourceId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(resource, updateBody);
  await resource.save();
  return resource;
};

/**
 * Delete resource by id
 * @param {ObjectId} resourceId
 * @returns {Promise<Resource>}
 */
const deleteResourceById = async (resourceId) => {
  const resource = await getResourceById(resourceId);
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  await resource.remove();
  return resource;
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  getResourceByEmail,
  updateResourceById,
  deleteResourceById,
};
