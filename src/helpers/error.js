const dir = require('../helpers/dirConfig');
const STATUS_CODES = require(dir.helpers + '/constants');
const {sendResponse} = require(dir.helpers + '/utils');

class AppError extends Error {
    constructor(message, statusCode, error) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.response = error || {};

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * @description
 * The following method is a centralized way to handle application errors.
 * @param {object} error - The error object to be handled.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {void} This function does not return a value.
 */
const handleError = (error, req, res) => {
    const statusCode = error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    delete error?.statusCode;

    sendResponse(res, statusCode, error.message || 'Internal Server Error', [], error);
};

module.exports = {
    AppError,
    handleError,
};
