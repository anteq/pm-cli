const { wrap } = require('../wrap');

module.exports = {
    key: 'search',
    name: 'Search',
    triggers: ['{project} '],
    arguments: true,
    resolve: resolveSearch
};

function resolveSearch(context, value) {
    return {
        url: createSearchUrl(context, value),
        text: wrap(`Search for {search} within {project}`, { search: value, project: context.project.name })
    };
}

function createSearchUrl(context, value) {
    var searchString = `project = ${context.project.key.toUpperCase()} and text ~ "${value}" order by created desc`;
    return `${context.project.baseUrl}/issues/?jql=${escape(searchString)}`;
}