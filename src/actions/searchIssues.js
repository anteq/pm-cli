const { wrap } = require('../wrap');

module.exports = {
    key: 'searchIssues',
    name: 'Search issues',
    triggers: ['{project} '],
    arguments: true,
    resolve: resolveSearch
};

function resolveSearch(context, value) {
    return {
        url: createSearchUrl(context, value),
        text: wrap(`Search ${value ? 'for {search}': ''} within {project}`, { search: value, project: context.project.key.toUpperCase() })
    };
}

function createSearchUrl(context, value) {
    var searchString = `project = ${context.project.key.toUpperCase()} and text ~ "${value}" order by created desc`;
    return `${context.project.baseUrl}/issues/?jql=${escape(searchString)}`;
}