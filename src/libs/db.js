const dir = require('../helpers/dirConfig');
const knex = require('knex');
const __config = require(dir.configs + '/prod.json');
const knexConfig = {
    client: 'mysql',
    connection: __config.connections.mysql,
    postProcessResponse: (result, queryContext) => {
        if (Array.isArray(result)) {
            return result.map((row) => JSON.parse(JSON.stringify(row)));
        } else {
            return JSON.parse(JSON.stringify(result));
        }
    },
};
const db = knex(knexConfig);

module.exports = db;
