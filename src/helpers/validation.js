const Validator = require('fastest-validator');

const validator = new Validator();

const userGetByCompositeKeySheme = {
    compositeKey: {type: 'string', optional: false},
};

const userCreateScheme = {
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
    id: {type: 'number', integer: true, optional: false},
    name: {type: 'string', optional: true, min: 2},
    surname: {type: 'string', optional: true, min: 2},
    patronymic: {type: 'string', optional: true},
    min: 2,
    phone: {type: 'string', optional: true, min: 10},
    email: {type: 'email', optional: true},
    address: {type: 'string', optional: true, min: 20},
    // photos: {type: 'array', optional: true},
    // videos: {type: 'array', optional: true},
};

const userDeleteByIdSheme = {
    id: {type: 'number', integer: true, optional: false},
};

const userDeleteByKeySheme = {
    key: {type: 'string', optional: false, min: 30},
};

module.exports = {
    validator,
    userGetByCompositeKeySheme,
    userCreateScheme,
    userUpdateScheme,
    userDeleteByIdSheme,
    userDeleteByKeySheme,
};
