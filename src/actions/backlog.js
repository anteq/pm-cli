const { projects } = require('../config');

module.exports = {
    key: 'backlog',
    name: 'See backlog',
    triggers: ['{project} backlog'],
    arguments: false,
    url: createBacklogUrl
};

function createBacklogUrl(context, value) {
    return `${context.project.baseUrl}/secure/RapidBoard.jspa?rapidView=${context.project.jiraRapidViewId}&projectKey=${context.project.key.toUpperCase()}&view=planning`;
}