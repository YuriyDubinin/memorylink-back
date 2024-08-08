const dir = require('../helpers/dirConfig');
const RequestService = require(dir.services + '/request.service');
const {AppError} = require(dir.helpers + '/error');
const {STATUS_CODES} = require(dir.helpers + '/constants');
const {sendResponse} = require(dir.helpers + '/utils');
const {validator, requestCreateScheme} = require(dir.helpers + '/validation');

class RequestController {
    /**
     * @description
     * This controller method to create user request.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} passToNext - The next middlwares function in the application's requestresponce cicle.
     * @returns {Promise<void>} A promise that resolves to void.
     */
    async createRequest(req, res, passToNext) {
        const {name, surname, patronymic, phone, email, text} = req.body;
        const validationResponse = validator.validate(
            {
                name,
                surname,
                patronymic,
                phone,
                email,
                text,
            },
            requestCreateScheme,
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
            const result = await RequestService.createRequest(
                name,
                surname,
                patronymic,
                phone,
                email,
                text,
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
}

module.exports = new RequestController();
