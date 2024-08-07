const dir = require('../helpers/dirConfig');
const UserService = require(dir.services + '/user.service');
const {AppError} = require(dir.helpers + '/error');
const {STATUS_CODES} = require(dir.helpers + '/constants');
const {sendResponse} = require(dir.helpers + '/utils');
const {
    validator,
    userGetByCompositeKeySheme,
    userCreateScheme,
    userUpdateScheme,
    userDeleteByKeySheme,
} = require(dir.helpers + '/validation');

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

        const validationResponse = validator.validate({compositeKey}, userGetByCompositeKeySheme);

        if (validationResponse !== true) {
            return passToNext(
                new AppError(validationResponse[0].message, STATUS_CODES.BAD_REQUEST),
                validationResponse[0],
            );
        }

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
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} - The next middlwares function in the application's requestresponce cicle.
     * @returns {Promise<void>} A promise that resolves to void.
     */
    async createUser(req, res, passToNext) {
        const {password, name, surname, patronymic, phone, email, address} = req.body;
        const photos = req.files?.photos || null;
        const videos = req.files?.videos || null;

        const validationResponse = validator.validate(
            {
                password,
                name,
                surname,
                patronymic,
                phone,
                email,
                address,
                photos,
                videos,
            },
            userCreateScheme,
        );

        if (validationResponse !== true) {
            return passToNext(
                new AppError(
                    validationResponse[0].message,
                    STATUS_CODES.BAD_REQUEST,
                    validationResponse[0],
                ),
            );
        }

        try {
            const result = await UserService.createUser(
                password,
                name,
                surname,
                patronymic,
                phone,
                email,
                address,
                photos,
                videos,
            );

            if (result.status === 'fail') {
                return passToNext(new AppError(result.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
            }

            if (result.status === 'success') {
                return sendResponse(res, STATUS_CODES.OK, result.message, {
                    id: result.id,
                    key: result.key,
                });
            }
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
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} - The next middlwares function in the application's requestresponce cicle.
     * @returns {Promise<void>} A promise that resolves to void.
     */
    async updateUserByKey(req, res, passToNext) {
        const {password, key, name, surname, patronymic, phone, email, address} = req.body;
        const photos = req.files?.photos || null;
        const videos = req.files?.videos || null;

        const validationResponse = validator.validate(
            {password, key, name, surname, patronymic, phone, email, address, photos, videos},
            userUpdateScheme,
        );

        if (validationResponse !== true) {
            return passToNext(
                new AppError(
                    validationResponse[0].message,
                    STATUS_CODES.BAD_REQUEST,
                    validationResponse[0],
                ),
            );
        }

        try {
            const result = await UserService.updateUserByKey(
                password,
                key,
                name,
                surname,
                patronymic,
                phone,
                email,
                address,
                photos,
                videos,
            );

            if (result.status === 'fail') {
                return passToNext(new AppError(result.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
            }

            if (result.status === 'success') {
                return sendResponse(res, STATUS_CODES.OK, result.message, {
                    id: result.id,
                    key: result.key,
                });
            }
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

        const validationResponse = validator.validate({key}, userDeleteByKeySheme);

        if (validationResponse !== true) {
            return passToNext(
                new AppError(
                    validationResponse[0].message,
                    STATUS_CODES.BAD_REQUEST,
                    validationResponse[0],
                ),
            );
        }

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
