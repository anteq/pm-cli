const { wrap } = require('../wrap');

module.exports = {
    key: 'openProject',
    name: 'Open project by code',
    context: 'project',
    triggers: ['{project}'],
    arguments: false,
    resolve: resolveOpen
};

function resolveOpen(context, value) {
    return {
        url: `${context.project.baseUrl}/secure/RapidBoard.jspa?rapidView=${context.project.jiraRapidViewId}&projectKey=${context.project.key.toUpperCase()}`,
        text: wrap(`Open {project}`, {project: context.project.key.toUpperCase()})
    };
}