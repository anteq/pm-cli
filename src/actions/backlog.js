const { projects } = require('../config');

module.exports = {
    key: 'backlog',
    name: 'See backlog',
    triggers: ['{project} backlog'],
    arguments: false,
    resolve: resolveBacklog
};

function resolveBacklog(context, value) {
    return {
        url: `${context.project.baseUrl}/secure/RapidBoard.jspa?rapidView=${context.project.jiraRapidViewId}&projectKey=${context.project.key.toUpperCase()}&view=planning`,
        text: 'Go to Backlog'
    };
}