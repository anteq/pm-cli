const { wrap } = require('../wrap');

const config = {
    key: 'openProject',
    name: 'Open project by code',
    icon: '🚪',
    context: 'project',
    triggers: ['{project}'],
    arguments: false,
    layout: 'hero',
    resolve: resolveOpen
};
module.exports = config;

function resolveOpen(state) {
    const project = state.match.project;
    return {
        url: `${project.baseUrl}/secure/RapidBoard.jspa?rapidView=${project.jiraRapidViewId}&projectKey=${project.key.toUpperCase()}`,
        text: wrap(`Open {project}`, {project: project.key.toUpperCase()}),
        icon: config.icon
    };
}