const moment = require('moment');
const dir = require('../helpers/dirConfig');
const RequestModel = require(dir.models + '/request.model');
const {sendMessageToTargetGroup} = require(dir.bots + '/RequestBot');

class RequestService {
    /**
     * @description
     * This service method to create user request.
     * @param {string} name - User name.
     * @param {string} surname - User surname.
     * @param {string} patronymic - User patronymic.
     * @param {string} phone - User phone.
     * @param {string} email - User email.
     * @param {string} text - User text.
     * @returns {object} The object of user.
     */
    async createRequest(name, surname, patronymic, phone, email, text) {
        const createTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        const createdRequest = await RequestModel.createRequest(
            createTime,
            name,
            surname,
            patronymic,
            phone,
            email,
            text,
        );

        if (!createdRequest.length) {
            return {status: 'fail', message: 'Error recording user'};
        }

        if (createdRequest.length) {
            const request = await RequestModel.getRequestById(createdRequest[0]);
            const message = `
                            ${moment(request[0].createTime).format('DD.MM.YYYY HH:mm:ss')}\n${
                                request[0].surname
                            } ${request[0].name} ${request[0].patronymic}\n${request[0].phone}\n${
                                request[0].email || '-'
                            }\n${request[0].text}`;

            sendMessageToTargetGroup(message);

            return {
                status: 'success',
                message: `User with id ${createdRequest[0]} created successfully`,
                id: createdRequest[0],
            };
        }
    }
}

module.exports = new RequestService();
