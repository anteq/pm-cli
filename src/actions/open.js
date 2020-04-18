const { projects } = require('../config');

module.exports = {
    key: 'open',
    name: 'Open issue by code',
    triggers: ['{project}-'],
    arguments: true,
    url: createOpenUrl
};

function createOpenUrl(context, value) {
    return `${context.project.baseUrl}/browse/${context.project.key.toUpperCase()}-${parseInt(value)}`;
}