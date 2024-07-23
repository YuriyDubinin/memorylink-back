/**
 * @description
 * Determines the CORS policy for a given request based on the origin of the request.
 * @param {object} req - The request object, which contains details about the HTTP request.
 * @param {function} callback - A callback function to be executed with the CORS options.
 * @returns {void} This function does not return a value.
 */
const delegateCorsOptions = function (req, callback) {
    let corsOptions;

    if (process.env.ALLOW_LIST.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {origin: true};
    } else {
        corsOptions = {origin: false};
    }
    callback(null, corsOptions);
};

module.exports = {delegateCorsOptions};
