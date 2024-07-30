const dir = require('../helpers/dirConfig');
const fs = require('fs/promises');
const path = require('path');
const {v4} = require('uuid');

/**
 * @description
 * Creates a file structure for the user.
 * @param {string} key - Unique user key.
 * @returns {object} Object with status & message.
 */
async function createUserFileStructure(key) {
    const userDirPath = path.join(dir.static, 'users', key);

    try {
        // Check the existence & access rights to the name directory
        try {
            await fs.access(path.join(dir.static, 'users'));
        } catch (accessError) {
            console.error(`Access error: ${accessError.message}`);

            return {
                status: 'fail',
                message: `Access error: not related to user rights, the problem is access to file structure`,
            };
        }

        const isUserExist = await fs
            .access(userDirPath)
            .then(() => true)
            .catch(() => false);

        if (!isUserExist) {
            // Creating the user's main directory
            await fs.mkdir(userDirPath, {recursive: true});

            // Creating users photos and videos directories
            await fs.mkdir(path.join(userDirPath, 'photos'));
            await fs.mkdir(path.join(userDirPath, 'videos'));

            console.log(`User directory structure for ${key} has been created.`);

            return {
                status: 'success',
                message: `User directory structure for ${key} has been created.`,
            };
        } else {
            console.log(`User directory with name ${key} already exists.`);

            return {
                status: 'fail',
                message: `User directory with name ${key} already exists.`,
            };
        }
    } catch (error) {
        console.error(error);

        return {status: 'fail', message: 'Unknown error when creating file structure'};
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
async function uploadUserFiles(key, category, data) {
    const hashes = [];

    try {
        for (const file of data) {
            const fileHash = `${v4()}.${file.name.split('.').pop()}`;
            const filePath = path.join(dir.static, 'users', key, category, fileHash);

            await file.mv(filePath);

            hashes.push(fileHash);
        }
    } catch (error) {
        console.error(error);
    }

    return hashes;
}

/**
 * @description
 * Deletes a user's file structure.
 * @param {string} key - Unique user key.
 * @returns {void} - This function does not return a value.
 */
async function deleteUserFileStructureByKey(key) {
    const userDirPath = path.join(dir.static, '/users', key);

    try {
        if (
            await fs
                .access(userDirPath)
                .then(() => true)
                .catch(() => false)
        ) {
            // Delete nested directories
            await fs.rm(path.join(userDirPath, 'photos'), {recursive: true, force: true});
            await fs.rm(path.join(userDirPath, 'videos'), {recursive: true, force: true});

            // Deleting user's main directory
            await fs.rm(userDirPath, {recursive: true, force: true});

            console.log(`User directory structure for ${key} has been deleted.`);
        } else {
            console.log(`User directory ${key} does not exist.`);
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createUserFileStructure,
    uploadUserFiles,
    deleteUserFileStructureByKey,
};
