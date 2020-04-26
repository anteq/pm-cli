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

async function resolveSearch(state) {
    let data;
    const project = state.match.project;
    await jira.searchIssues(project, buildJQL(project, state.match.input)).then(
        (result) => {
            data = result
        }, (error) => {
            console.error('err', error);
        }
    );
    return {
        url: createSearchUrl(project, state.match.input),
        content: {
            items: data,
            text: wrap(`Search ${state.match.input ? 'for {search}': ''} within {project}`, { search: state.match.input, project: project.key.toUpperCase() }),
        }
    };
}

function buildJQL(project, value) {
    return `project = ${project.key.toUpperCase()} ${ value ? 'and text ~"' + value + '\"' : ''} order by created desc`;
}

function createSearchUrl(project, value) {
    return `${project.baseUrl}/issues/?jql=${escape(buildJQL(project, value))}`;
}