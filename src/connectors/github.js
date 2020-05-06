const { api } = require('../config');
const rest = require('../rest');

const auth = {
    'Authorization': 'Basic ' + Buffer.from(api.github.login + ":" + api.github.key).toString("base64")
};

function get(url) { 
    let call = rest.get(url, auth);
    return call;
}

function getPullById(repo, id) {
    const url = `https://api.github.com/repos/${repo}/pulls/${id}`;
    return get(url).then(response => {
        return {
            // labels: response.data.labels.map(x => buildLabel(x))
            labels: response.data.labels.map(x => x.name).join(', ')
        };
    });
}

function buildLabel(x) {
    return {
        name: x.name,
        color: x.color
    };
}

module.exports = { getPullById };