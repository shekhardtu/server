const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { responseObj } = require('../utils/helper');
const catchAsync = require('../utils/catchAsync');
const { resourceService } = require('../services');

const createResource = catchAsync(async (req, res) => {
  req.body.createdBy = req.resource.id;
  const resource = await resourceService.createResource(req.body);
  res.status(httpStatus.CREATED).send(resource);
});

const getResources = catchAsync(async (req, res) => {
  const result = await resourceService.getResources(req.params.userId);
  res.send(result);
});

const getResource = catchAsync(async (req, res) => {
  const resource = await resourceService.getResourceById(req.params.resourceId);
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  res.send(responseObj(resource, 'Success'));
});

const updateResource = catchAsync(async (req, res) => {
  const resource = await resourceService.updateResourceById(req.params.resourceId, req.body);
  res.send(resource);
});

const deleteResource = catchAsync(async (req, res) => {
  await resourceService.deleteResourceById(req.params.resourceId);
  res.send({ status: `Resource ${req.params.resourceId} Deleted Successfully` }).status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
};
