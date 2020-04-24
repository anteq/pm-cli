const { wrap } = require('../wrap');

const config = {
    key: 'openBacklog',
    name: 'See backlog',
    icon: '📚',
    context: 'project',
    triggers: ['{project} backlog'],
    arguments: false,
    layout: 'hero',
    resolve: resolveBacklog
};
module.exports = config;

function resolveBacklog(context, value) {
    return {
        url: `${context.project.baseUrl}/secure/RapidBoard.jspa?rapidView=${context.project.jiraRapidViewId}&projectKey=${context.project.key.toUpperCase()}&view=planning`,
        text: wrap(`Go to {project} Backlog`, { project: context.project.key.toUpperCase() }),
        action: config
    };
}