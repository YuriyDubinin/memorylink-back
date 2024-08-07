const moment = require('moment');
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
     * @param {string} password - User password.
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
    async createUser(password, name, surname, patronymic, phone, email, address, photos, videos) {
        const key = v4();
        const createTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        let photoUploadResult;
        let videoUploadResult;

        const fsCreationResult = await createUserFileStructure(key);

        if (fsCreationResult && fsCreationResult.status === 'fail') {
            return {status: 'fail', message: fsCreationResult.message};
        }

        // Additional conversion of photos & to array & saved in in the desired directory
        if (photos) {
            if (!Array.isArray(photos)) {
                photos = [photos];
            }

            photoUploadResult = await uploadUserFiles(key, 'photos', photos);

            if (photoUploadResult && photoUploadResult.status === 'fail') {
                return {status: 'fail', message: photoUploadResult.message};
            }
        }

        // Additional conversion of videos & to array & saved in in the desired directory
        if (videos) {
            if (!Array.isArray(videos)) {
                videos = [videos];
            }

            videoUploadResult = await uploadUserFiles(key, 'videos', videos);

            if (videoUploadResult && videoUploadResult.status === 'fail') {
                return {status: 'fail', message: videoUploadResult.message};
            }
        }

        const createdUser = await UserModel.createUser(
            password,
            createTime,
            key,
            name,
            surname,
            patronymic,
            phone,
            email,
            address,
            JSON.stringify(photoUploadResult?.hashes),
            JSON.stringify(videoUploadResult?.hashes),
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
     * @param {string} password - User password.
     * @param {number} key - Unique user id.
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
    async updateUserByKey(
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
    ) {
        const updateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        let photoUploadResult;
        let videoUploadResult;

        // User presence check
        const user = await UserModel.getUserByKey(key);

        if (!user.length) {
            return {status: 'fail', message: 'User not exists'};
        }

        // Additional conversion of photos & to array & saved in in the desired directory
        if (photos) {
            if (!Array.isArray(photos)) {
                photos = [photos];
            }

            photoUploadResult = await uploadUserFiles(key, 'photos', photos);

            if (photoUploadResult && photoUploadResult.status === 'fail') {
                return {status: 'fail', message: photoUploadResult.message};
            }
        }

        // Additional conversion of videos & to array & saved in in the desired directory
        if (videos) {
            if (!Array.isArray(videos)) {
                videos = [videos];
            }

            videoUploadResult = await uploadUserFiles(key, 'videos', videos);

            if (videoUploadResult && videoUploadResult.status === 'fail') {
                return {status: 'fail', message: videoUploadResult.message};
            }
        }

        const updatedUser = await UserModel.updateUserByKey(
            password,
            updateTime,
            key,
            name,
            surname,
            patronymic,
            phone,
            email,
            address,
            JSON.stringify(photoUploadResult?.hashes),
            JSON.stringify(videoUploadResult?.hashes),
        );

        if (!updatedUser) {
            return {status: 'fail', message: 'Error recording user'};
        }

        return {
            status: 'success',
            message: `User with key ${key} updated successfully`,
            key,
        };
    }

    /**
     * @description
     * The service method to delete user by key.
     * @param {string} key - Unique user key.
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

    /**
     * @description
     * The service method to check user by composite key.
     * @param {string} compositeKey - Unique user key.
     * @returns {object} The object containing status.
     */
    async checkUserByCompositeKey(compositeKey) {
        const id = parseInt(compositeKey.split('id=')[1]);
        const user = await UserModel.getUserById(id);

        if (!user.length) {
            return {
                status: 'fail',
                message: `User not found`,
                
            };
        }

        return {
            status: 'success',
            message: `User check successfully`,
            
        };
    }
}

module.exports = new UserService();
