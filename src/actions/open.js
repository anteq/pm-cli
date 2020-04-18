const { projects } = require('../config');

module.exports = {
    key: 'open',
    name: 'Open issue by code',
    triggers: ['{project}-'],
    arguments: true,
    resolve: resolveOpen
};

function resolveOpen(context, value) {
    return {
        url: `${context.project.baseUrl}/browse/${context.project.key.toUpperCase()}-${parseInt(value)}`,
        text: 'Open task'
    };
}