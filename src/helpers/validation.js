const Validator = require('fastest-validator');

const validator = new Validator();

const userGetByCompositeKeySheme = {
    compositeKey: {type: 'string', optional: false},
};

const userCreateScheme = {
    password: {type: 'string', optional: true},
    name: {type: 'string', optional: false, min: 2},
    surname: {type: 'string', optional: false, min: 2},
    patronymic: {type: 'string', optional: false, min: 2},
    phone: {type: 'string', optional: false, min: 10},
    email: {type: 'email', optional: true},
    address: {type: 'string', optional: false, min: 20},
    // photos: {type: 'array', optional: true},
    // videos: {type: 'array', optional: true},
};

const userUpdateScheme = {
    password: {type: 'string', optional: true},
    key: {type: 'string', optional: false, min: 30},
    name: {type: 'string', optional: true},
    surname: {type: 'string', optional: true},
    patronymic: {type: 'string', optional: true},
    phone: {type: 'string', optional: true},
    email: {type: 'email', optional: true},
    address: {type: 'string', optional: true},
    // photos: {type: 'object', optional: true},
    // videos: {type: 'object', optional: true},
};

const userDeleteByKeySheme = {
    key: {type: 'string', optional: false, min: 30},
};

const userCheckByCompositeKeySheme = {
    compositeKey: {type: 'string', optional: false},
};

module.exports = {
    validator,
    userGetByCompositeKeySheme,
    userCreateScheme,
    userUpdateScheme,
    userDeleteByKeySheme,
    userCheckByCompositeKeySheme
};
