const path = require('path');

const dir = {
    root: __dirname,
    configs: path.join(__dirname, '../../configs'),
    static: path.join(__dirname, '../../static'),
    controllers: path.join(__dirname, '..', 'controllers'),
    helpers: path.join(__dirname, '..', 'helpers'),
    libs: path.join(__dirname, '..', 'libs'),
    models: path.join(__dirname, '..', 'models'),
    routes: path.join(__dirname, '..', 'routes'),
    services: path.join(__dirname, '..', 'services'),
};

module.exports = dir;
