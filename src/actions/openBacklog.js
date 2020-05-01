const { wrap } = require('../wrap');

const config = {
    key: 'openBacklog',
    name: 'See backlog',
    icon: '📚',
    triggers: ['{project} backlog'],
    arguments: false,
    layout: 'hero',
    resolve: resolveBacklog
};
module.exports = config;

function resolveBacklog(state) {
    const project = state.match.project;
    return {
        url: `${project.baseUrl}/secure/RapidBoard.jspa?rapidView=${project.jiraRapidViewId}&projectKey=${project.key.toUpperCase()}&view=planning`,
        icon: config.icon,
        text: wrap(`Go to {project} Backlog`, { project: project.key.toUpperCase() })
    };
}