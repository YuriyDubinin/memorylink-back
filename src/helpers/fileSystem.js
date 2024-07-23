const dir = require('../helpers/dirConfig');
const fs = require('fs');
const path = require('path');
const {v4} = require('uuid');
const {AppError} = require(dir.helpers + '/error');

/**
 * @description
 * Creates a file structure for the user.
 * @param {string} key - Unique user key.
 * @returns {void} - This function does not return a value.
 */
function createUserFileStructure(key) {
    const userDirName = key;

    try {
        if (!fs.existsSync(path.join(`${__dirname}/users`, userDirName))) {
            fs.mkdirSync(path.join(`${__dirname}`, '..', '../public/users', userDirName), (err) => {
                if (err) {
                    console.log('err: ', err);
                    return;
                }
            });

            fs.mkdirSync(
                path.join(`${__dirname}`, '..', `../public/users/${userDirName}`, 'photos'),
            );

            fs.mkdirSync(
                path.join(`${__dirname}`, '..', `../public/users/${userDirName}`, 'videos'),
            );
        }
    } catch (error) {
        // TODO: handle the error
        console.error(error);
    }
}

/**
 * @description
 * Loads the users files into the user's directory using his key.
 * @param {string} key - Unique user key.
 * @param {string} category - File category.
 * @param {Array} data - Data array.
 * @returns {Array<string>} Array of hashes.
 */
function uploadUserFiles(key, category, data) {
    const hashes = [];

    try {
        data.map((file) => {
            const fileHash = `${v4()}.${file.name.split('.').pop()}`;

            file.mv(
                path.join(`${__dirname}`, '..', `../public/users/${key}/${category}`, fileHash),
            );

            hashes.push(fileHash);
        });

        return hashes;
    } catch (error) {
        // TODO: handle the error
        console.error(error);
    }
}

module.exports = {
    createUserFileStructure,
    uploadUserFiles,
};
