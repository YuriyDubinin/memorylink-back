const Validator = require('fastest-validator');

const validator = new Validator();

const userCreateScheme = {
    name: {type: 'string', optional: false},
    surname: {type: 'string', optional: false},
    patronymic: {type: 'string', optional: false},
    phone: {type: 'string', optional: false},
    email: {type: 'email', optional: true},
    address: {type: 'string', optional: false},
    photos: {type: 'array', optional: true},
    videos: {type: 'array', optional: true},
};

const userUpdateScheme = {
    id: {type: 'number', integer: true, optional: false},
    name: {type: 'string', optional: true},
    surname: {type: 'string', optional: true},
    patronymic: {type: 'string', optional: true},
    phone: {type: 'string', optional: true},
    email: {type: 'email', optional: true},
    address: {type: 'string', optional: true},
    photos: {type: 'array', optional: true},
    videos: {type: 'array', optional: true},
};

module.exports = {
    validator,
    userCreateScheme,
    userUpdateScheme
};
