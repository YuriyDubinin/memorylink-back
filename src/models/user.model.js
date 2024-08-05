const dir = require('../helpers/dirConfig');
const db = require(dir.libs + '/db');

class UserModel {
    /**
     * @description
     * Fetch all users from database.
     * @returns {Promise<object[]>} A promise that resolves to an array of user objects.
     */
    async getAllUsers() {
        return await db('users');
    }

    /**
     * @description
     * Fetch user by key from database.
     * @param {string} key - Unique user key.
     * @returns {Promise<object[]>} A promise that resolves to an array with one object inside.
     */
    async getUserByKey(key) {
        return await db('users').where({key});
    }

    /**
     * @description
     * Fetch user by id from database.
     * @param {number} id - Unique user id.
     * @returns {Promise<object[]>} A promise that resolves to an array with one object inside.
     */
    async getUserById(id) {
        return await db('users').where({id});
    }

    /**
     * @description
     * Create user in database.
     * @param {Date} createTime - Time since user creation.
     * @param {string} key - Unique user key.
     * @param {string} name - User name.
     * @param {string} surname - User surname.
     * @param {string} patronymic - User patronymic.
     * @param {string} phone - User phone.
     * @param {string} email - User email.
     * @param {string} address - User address.
     * @param {Array<string>} photos- An array of hashes with users photos.
     * @param {Array<string>} address - An array of hashes with users videos.
     * @returns {Promise<object[]>} A promise that resolves to an array with one object inside.
     */
    async createUser(
        createTime,
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
        const query = await db('users').insert({
            key,
            createTime,
            name,
            surname,
            patronymic,
            phone,
            email,
            address,
            photos,
            videos,
        });

        return query;
    }

    /**
     * @description
     * Update user in database by id.
     * @param {Date} updateTime - User update time.
     * @param {string} key - Unique user key.
     * @param {string} name - User name.
     * @param {string} surname - User surname.
     * @param {string} patronymic - User patronymic.
     * @param {string} phone - User phone.
     * @param {string} email - User email.
     * @param {string} address - User address.
     * @param {Array<string>} photos- An array of hashes with users photos.
     * @param {Array<string>} address - An array of hashes with users videos.
     * @returns {Promise<object[]>} A promise that resolves to an array with one object inside.
     */
    async updateUserByKey(
        updateTime,
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
        const query = await db('users').where({key}).update({
            updateTime,
            name,
            surname,
            patronymic,
            phone,
            email,
            address,
            photos,
            videos,
        });

        return query;
    }

    /**
     * @description
     * Delete user by key from database.
     * @param {id} - Unique user key.
     * @returns {Promise<object[]>} A promise that resolves to an array with one object inside.
     */
    async deleteUserByKey(key) {
        return await db('users').where({key}).del();
    }
}

module.exports = new UserModel();
