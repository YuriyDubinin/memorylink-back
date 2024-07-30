const dir = require('../helpers/dirConfig');
const UserModel = require(dir.models + '/user.model');
const {createUserFileStructure, uploadUserFiles, deleteUserFileStructureByKey} = require(
    dir.helpers + '/fileSystem',
);
const {v4} = require('uuid');

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
     * @param {compositeKey} - Unique user key.
     * @returns {object} The object of user.
     */
    async getUserByCompositeKey(compositeKey) {
        const id = parseInt(compositeKey.split('id=')[1]);
        const user = await UserModel.getUserById(id);

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
        const key = v4();

        let photoshashes;
        let videoshahses;

        const fsIsCreated = await createUserFileStructure(key);

        if (fsIsCreated && fsIsCreated.status === 'fail') {
            return {status: 'fail', message: fsIsCreated.message};
        }

        // Additional conversion of photos & to array & saved in in the desired directory
        if (photos) {
            if (!Array.isArray(photos)) {
                photos = [photos];
            }

            photoshashes = await uploadUserFiles(key, 'photos', photos);
        }

        // Additional conversion of videos & to array & saved in in the desired directory
        if (videos) {
            if (!Array.isArray(videos)) {
                videos = [videos];
            }

            videoshahses = await uploadUserFiles(key, 'videos', videos);
        }

        const createdUser = await UserModel.createUser(
            key,
            name,
            surname,
            patronymic,
            phone,
            email,
            address,
            JSON.stringify(photoshashes),
            JSON.stringify(videoshahses),
        );

        if (!createdUser.length) {
            return {status: 'fail', message: 'Error recording user'};
        }

        return {
            status: 'success',
            message: `User with id ${createdUser[0]} created successfully`,
            id: createdUser[0],
            key,
        };
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
