const path = require('path');
const http = path.resolve(__dirname, 'node_modules/stream-http/index.js');

module.exports = {
    resolve: {
        alias: { http, https: http },
    },
    node: {
        global: true,
        Buffer: true
    }

};
