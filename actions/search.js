const { projects } = require('../config');

module.exports = {
    key: 'search',
    name: 'Search',
    triggers: ['{project} '],
    arguments: true,
    url: createSearchUrl
};

function createSearchUrl(context, value) {
    var searchString = `project = ${context.project.key.toUpperCase()} and text ~ "${value}" order by created desc`;
    return `${context.project.baseUrl}/issues/?jql=${escape(searchString)}`;
}