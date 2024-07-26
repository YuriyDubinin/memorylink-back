const dir = require('../helpers/dirConfig');
const Router = require('express');
const UserController = require(dir.controllers + '/user.controller');

const userRoutes = Router();

userRoutes.get('/list', UserController.getAllUsers);
userRoutes.get('/user', UserController.getUserByCompositeKey);
userRoutes.post('/user', UserController.createUser);
userRoutes.put('/user', UserController.updateUserById);
userRoutes.delete('/user', UserController.deleteUserById);
userRoutes.delete('/user/key', UserController.deleteUserByKey);

module.exports = userRoutes;
