const dir = require('../helpers/dirConfig');
const fs = require('fs');
const fsPromises = require('fs/promises');
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
            // Creating the user's main directory
            fs.mkdirSync(path.join(`${__dirname}`, '..', '../static/users', userDirName), (err) => {
                if (err) {
                    console.log('err: ', err);
                    return;
                }
            });

            // Creating users photos directory
            fs.mkdirSync(
                path.join(`${__dirname}`, '..', `../static/users/${userDirName}`, 'photos'),
            );

            // Creating users videos directory
            fs.mkdirSync(
                path.join(`${__dirname}`, '..', `../static/users/${userDirName}`, 'videos'),
            );

            console.log(`User directory structure for ${userDirName} has been created.`);
        } else {
            console.log(`User directory with name ${userDirName} already exist.`);
        }
    } catch (error) {
        console.log(error);
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

    data.map((file) => {
        const fileHash = `${v4()}.${file.name.split('.').pop()}`;

        file.mv(path.join(`${__dirname}`, '..', `../static/users/${key}/${category}`, fileHash));

        hashes.push(fileHash);
    });

    return hashes;
}

/**
 * @description
 * Deletes a user's file structure.
 * @param {string} key - Unique user key.
 * @returns {void} - This function does not return a value.
 */
function deleteUserFileStructureByKey(key) {
    const userDirName = key;
    const userDirPath = path.join(__dirname, '..', '../static/users', userDirName);

    try {
        if (fs.existsSync(userDirPath)) {
            // Delete nested directories
            fsPromises.rm(path.join(userDirPath, 'photos'), {recursive: true});
            fsPromises.rm(path.join(userDirPath, 'videos'), {recursive: true});

            // Deleting the user's main directory
            fsPromises.rm(userDirPath, {recursive: true});

            console.log(`User directory structure for ${userDirName} has been deleted.`);
        } else {
            console.log(`User directory ${userDirName} does not exist.`);
        }
    } catch (error) {
        throw error;
        console.error(error);
    }
}

module.exports = {
    createUserFileStructure,
    uploadUserFiles,
    deleteUserFileStructureByKey,
};
