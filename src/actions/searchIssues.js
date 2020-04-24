const { wrap } = require('../wrap');
const jira = require('../connectors/jira');

const config = {
    key: 'searchIssues',
    name: 'Search issues',
    icon: '🔍',
    context: 'project',
    triggers: ['{project} '],
    arguments: true,
    layout: 'list',
    resolve: resolveSearch
};
module.exports = config;

async function resolveSearch(context, value) {
    let data;
    await jira.searchIssues(context, buildJQL(context, value)).then(
        (result) => {
            data = result
        }, (error) => {
            console.error('err', error);
        }
    );
    return {
        url: createSearchUrl(context, value),
        text: wrap(`Search ${value ? 'for {search}': ''} within {project}`, { search: value, project: context.project.key.toUpperCase() }),
        action: config,
        issues: data
    };
}

function buildJQL(context, value) {
    return `project = ${context.project.key.toUpperCase()} ${ value ? 'and text ~"' + value + '\"' : ''} order by created desc`;
}

function createSearchUrl(context, value) {
    return `${context.project.baseUrl}/issues/?jql=${escape(buildJQL(context, value))}`;
}