const dir = require('../helpers/dirConfig');
const Router = require('express');
const RequestController = require(dir.controllers + '/request.controller');

const requestRoutes = Router();

requestRoutes.post('/request', RequestController.createRequest);

module.exports = requestRoutes;
