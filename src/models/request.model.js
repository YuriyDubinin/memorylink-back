const dir = require('../helpers/dirConfig');
const db = require(dir.libs + '/db');

class RequestModel {
    /**
     * @description
     * Fetch user request by id from database.
     * @param {number} id - Unique reuqest id.
     * @returns {Promise<object[]>} A promise that resolves to an array with one object inside.
     */
    async getRequestById(id) {
        return await db('requests').where({id});
    }

    /**
     * @description
     * Create user's request in database.
     * @param {Date} createTime - Time since user creation.
     * @param {string} name - User name.
     * @param {string} surname - User surname.
     * @param {string} patronymic - User patronymic.
     * @param {string} phone - User phone.
     * @param {string} email - User email.
     * @param {string} text - User address.
     * @returns {Promise<object[]>} A promise that resolves to an array with one object inside.
     */
    async createRequest(createTime, name, surname, patronymic, phone, email, text) {
        const query = await db('requests').insert({
            createTime,
            name,
            surname,
            patronymic,
            phone,
            email,
            text,
        });

        return query;
    }
}

module.exports = new RequestModel();
