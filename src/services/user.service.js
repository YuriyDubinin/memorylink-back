const dir = require('../helpers/dirConfig');
const CryptoJS = require('crypto-js');
const UserModel = require(dir.models + '/user.model');
const {createUserFileStructure, uploadUserFiles, deleteUserFileStructureByKey} = require(
    dir.helpers + '/fileSystem',
);
const {countStringBytes} = require(dir.helpers + '/utils');

class UserService {
    /**
     * @description
     * The service method to get list of all users
     * @returns {array} the array of users
     */
    async getAllUsers() {
        const users = await UserModel.getAllUsers();
        return users;
    }

    /**
     * @description
     * The service method to get user by key & prepares it.
     * @param {string} - Unique user key.
     * @returns {object} The object of user.
     */
    async getUserByKey(key) {
        const user = await UserModel.getUserByKey(key);

        if (!user.length) {
            return null;
        }

        const preparedUser = {
            ...user[0],
            photos: JSON.parse(user[0].photos),
            videos: JSON.parse(user[0].videos),
        };

        return preparedUser;
    }

    /**
     * @description
     * This service method to create user.
     * @param {string} name - User name.
     * @param {string} surname - User surname.
     * @param {string} patronymic - User patronymic.
     * @param {string} phone - User phone.
     * @param {string} email - User email.
     * @param {string} address - User address.
     * @param {Array<string>} photos - An array of hashes with users photos.
     * @param {Array<string>} address - An array of hashes with users videos.
     * @returns {object} The object of user.
     */
    async createUser(name, surname, patronymic, phone, email, address, photos, videos) {
        const specialData = {name, surname, phone};
        const key = CryptoJS.AES.encrypt(
            JSON.stringify(specialData),
            process.env.ENCRYPTION_SALT_KEY_1,
        )
            .toString()
            .replace(/[//]/g, process.env.ENCRYPTION_SALT_KEY_2);
        const keyBytesLength = countStringBytes(key);

        let photohashes;
        let videohahses;

        if (keyBytesLength > 254) {
            return null;
        }

        // Additional conversion of photos & to array & saved in in the desired directory
        if (photos) {
            if (!Array.isArray(photos)) {
                photos = [photos];
            }

            photohashes = uploadUserFiles(key, 'photos', photos);
        }

        // Additional conversion of videos & to array & saved in in the desired directory
        if (videos) {
            if (!Array.isArray(videos)) {
                videos = [videos];
            }

            videohahses = uploadUserFiles(key, 'videos', videos);
        }

        createUserFileStructure(key);

        const result = await UserModel.createUser(
            key,
            name,
            surname,
            patronymic,
            phone,
            email,
            address,
            JSON.stringify(photohashes),
            JSON.stringify(videohahses),
        );

        if (!result.length) {
            return null;
        }

        return {id: result[0], key};
    }

    /**
     * @description
     * This service method to create user.
     * @param {number} id - Unique user id.
     * @param {string} name - User name.
     * @param {string} surname - User surname.
     * @param {string} patronymic - User patronymic.
     * @param {string} phone - User phone.
     * @param {string} email - User email.
     * @param {string} address - User address.
     * @param {Array<string>} photos- An array of hashes with users photos.
     * @param {Array<string>} address - An array of hashes with users videos.
     * @returns {object} The object of user.
     */
    async updateUserById(id, name, surname, patronymic, phone, email, address, photos, videos) {
        const result = await UserModel.updateUserById(
            id,
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
            return null;
        }

        return result;
    }

    /**
     * @description
     * The service method to delete user by id.
     * @param {string} - Unique user key.
     * @returns {object} The object of user.
     */
    async deleteUserById(id) {
        const result = await UserModel.deleteUserById(id);

        if (!result) {
            return null;
        }

        return result;
    }

    /**
     * @description
     * The service method to delete user by key.
     * @param {string} - Unique user key.
     * @returns {object} The object of user.
     */
    async deleteUserByKey(key) {
        await deleteUserFileStructureByKey(key);

        const result = await UserModel.deleteUserByKey(key);

        if (!result) {
            return null;
        }

        return result;
    }
}

module.exports = new UserService();
