const axios = require('axios');

// todo handle canceling

function get(url, headers) {
    return axios({ headers, method: 'GET', url });
}

function post(url, headers, body) {
    return axios({ headers, method: 'POST', body, url });
}

module.exports = { get, post };