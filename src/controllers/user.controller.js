const dir = require('../helpers/dirConfig');
const UserService = require(dir.services + '/user.service');
const {AppError} = require(dir.helpers + '/error');
const {STATUS_CODES} = require(dir.helpers + '/constants');
const {sendResponse} = require(dir.helpers + '/utils');

class UserController {
    /**
     * @description
     * The controller method to fetch all users.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} passToNext - The next middleware function in the application's request-response cicle.
     * @returns {Promise<void>} A promise that resolves to void.
     */
    async getAllUsers(req, res, passToNext) {
        try {
            const users = await UserService.getAllUsers();

            if (!users.length) {
                return passToNext(new AppError('Users not found', STATUS_CODES.NOT_FOUND));
            }

            return sendResponse(res, STATUS_CODES.OK, 'All users fetched successfully', users);
        } catch (error) {
            return passToNext(
                new AppError(
                    error.message || 'Internal Server Error',
                    error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                    error.response || error,
                ),
            );
        }
    }

    /**
     * @description
     * This controller method to fetch user by key.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} - The next middlwares function in the application's requestresponce cicle.
     * @returns {Promise<void>} A promise that resolves to void.
     */
    async getUserByCompositeKey(req, res, passToNext) {
        const {compositeKey} = req.query;

        try {
            const user = await UserService.getUserByCompositeKey(compositeKey);

            if (!user) {
                return passToNext(new AppError('User not found', STATUS_CODES.NOT_FOUND));
            }

            return sendResponse(res, STATUS_CODES.OK, 'User fetched successfully', user);
        } catch (error) {
            return passToNext(
                new AppError(
                    error.message || 'Internal Server Error',
                    error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                    error.response || error,
                ),
            );
        }
    }

    /**
     * @description
     * This controller method to create user.
     * @param {string} name - User name.
     * @param {string} surname - User surname.
     * @param {string} patronymic - User patronymic.
     * @param {string} phone - User phone.
     * @param {string} email - User email.
     * @param {string} address - User address.
     * @param {Array<string>} photos- An array of hashes with users photos.
     * @param {Array<string>} address - An array of hashes with users videos.
     * @returns {Promise<void>} A promise that resolves to void.
     */
    async createUser(req, res, passToNext) {
        const {name, surname, patronymic, phone, email, address} = req.body;
        const photos = req.files?.photos || null;
        const videos = req.files?.videos || null;

        try {
            const result = await UserService.createUser(
                name,
                surname,
                patronymic,
                phone,
                email,
                address,
                photos,
                videos,
            );

            if (!result) {
                return passToNext(
                    new AppError('User not сreated', STATUS_CODES.INTERNAL_SERVER_ERROR),
                );
            }

            return sendResponse(
                res,
                STATUS_CODES.OK,
                `User with id ${result.id} created successfully`,
                result,
            );
        } catch (error) {
            return passToNext(
                new AppError(
                    error.message || 'Internal Server Error',
                    error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                    error.response || error,
                ),
            );
        }
    }

    /**
     * @description
     * This controller method to update user by id.
     * @param {number} id - Unique user id.
     * @param {string} name - User name.
     * @param {string} surname - User surname.
     * @param {string} patronymic - User patronymic.
     * @param {string} phone - User phone.
     * @param {string} email - User email.
     * @param {string} address - User address.
     * @param {Array<string>} photos - An array of hashes with users photos.
     * @param {Array<string>} address - An array of hashes with users videos.
     * @returns {Promise<void>} A promise that resolves to void.
     */
    async updateUserById(req, res, passToNext) {
        const {id, name, surname, patronymic, phone, email, address} = req.body;
        const photos = req.files?.photos || null;
        const videos = req.files?.videos || null;

        try {
            const result = await UserService.updateUserById(
                id,
                name,
                surname,
                patronymic,
                phone,
                email,
                address,
            );

            if (!result) {
                return passToNext(
                    new AppError(`User with id ${id} not found.`, STATUS_CODES.NOT_FOUND),
                );
            }

            return sendResponse(
                res,
                STATUS_CODES.OK,
                `User with id ${id} updated successfully`,
                result,
            );
        } catch (error) {
            return passToNext(
                new AppError(
                    error.message || 'Internal Server Error',
                    error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                    error.response || error,
                ),
            );
        }
    }

    /**
     * @description
     * This controller method to delete user by id.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} - The next middlwares function in the application's requestresponce cicle.
     * @returns {Promise<void>} A promise that resolves to void.
     */
    async deleteUserById(req, res, passToNext) {
        const {id} = req.query;

        try {
            const result = await UserService.deleteUserById(id);

            if (!result) {
                return passToNext(
                    new AppError(`User with id ${id} not found.`, STATUS_CODES.NOT_FOUND),
                );
            }

            return sendResponse(res, STATUS_CODES.OK, `User with id ${id} deleted successfully`);
        } catch (error) {
            return passToNext(
                new AppError(
                    error.message || 'Internal Server Error',
                    error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                    error.response || error,
                ),
            );
        }
    }

    /**
     * @description
     * This controller method to delete user by key.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} - The next middlwares function in the application's requestresponce cicle.
     * @returns {Promise<void>} A promise that resolves to void.
     */
    async deleteUserByKey(req, res, passToNext) {
        const {key} = req.query;

        try {
            const result = await UserService.deleteUserByKey(key);

            if (!result) {
                return passToNext(
                    new AppError(`User with key ${key} not found.`, STATUS_CODES.NOT_FOUND),
                );
            }

            return sendResponse(res, STATUS_CODES.OK, `User with key ${key} deleted successfully`);
        } catch (error) {
            return passToNext(
                new AppError(
                    error.message || 'Internal Server Error',
                    error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                    error.response || error,
                ),
            );
        }
    }
}

module.exports = new UserController();
