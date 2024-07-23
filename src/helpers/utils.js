/**
 * @description
 * Responsible for sending a response back to the client.
 * @param {object} res - The response object.
 * @param {number} statusCode - The http status code.
 * @param {string} message -The message to be sent to the client.
 * @param {array} result - The result array when the request is successful.
 * @param {object} error - The error object to be sent to the client (when exist).
 * @returns {void} This function does not return a value.
 */
function sendResponse(res, statusCode, message, result = [], error = {}) {
    res.status(statusCode).json({
        statusCode,
        message,
        data: result,
        error,
    });
}

/**
 * @description
 * Counts the number of bytes in a string.
 * @param {string} string - Measured string.
 * @returns {number} Number of bytes.
 */
function countStringBytes(string) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(string);

    return bytes.length;
}

module.exports = {
    sendResponse,
    countStringBytes,
};
