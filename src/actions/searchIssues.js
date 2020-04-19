const { wrap } = require('../wrap');

const config = {
    key: 'searchIssues',
    name: 'Search issues',
    icon: '🔍',
    context: 'project',
    triggers: ['{project} '],
    arguments: true,
    resolve: resolveSearch
};
module.exports = config;

function resolveSearch(context, value) {
    return {
        url: createSearchUrl(context, value),
        text: wrap(`Search ${value ? 'for {search}': ''} within {project}`, { search: value, project: context.project.key.toUpperCase() }),
        icon: config.icon
    };
}

function createSearchUrl(context, value) {
    var searchString = `project = ${context.project.key.toUpperCase()} ${ value ? 'and text ~"' + value + '\"' : ''} order by created desc`;
    return `${context.project.baseUrl}/issues/?jql=${escape(searchString)}`;
}