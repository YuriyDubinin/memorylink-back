const dir = require('../helpers/dirConfig');
const Router = require('express');
const UserController = require(dir.controllers + '/user.controller');

const userRoutes = Router();

userRoutes.get('/list', UserController.getAllUsers);
userRoutes.get('/user', UserController.getUserByKey);
userRoutes.post('/user', UserController.createUser);
userRoutes.put('/user', UserController.updateUserById);
userRoutes.delete('/user', UserController.deleteUserById);

module.exports = userRoutes;
