const { wrap } = require('../wrap');

const config = {
    key: 'openProject',
    name: 'Open project by code',
    icon: '🚪',
    context: 'project',
    triggers: ['{project}'],
    arguments: false,
    resolve: resolveOpen
};
module.exports = config;

function resolveOpen(context, value) {
    return {
        url: `${context.project.baseUrl}/secure/RapidBoard.jspa?rapidView=${context.project.jiraRapidViewId}&projectKey=${context.project.key.toUpperCase()}`,
        text: wrap(`Open {project}`, {project: context.project.key.toUpperCase()}),
        icon: config.icon
    };
}