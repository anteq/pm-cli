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

let call;

function resolveSearch(state) {
    setTimeout(() => callSearch(state));
    return {
        url: createSearchUrl(state.match.project, state.match.input),
        text: wrap(`Search ${state.match.input ? 'for {search}': ''} within {project}`, { search: state.match.input, project: state.match.project.key.toUpperCase() })
    };
}

function callSearch(state) {
    if (call) call.cancel();
    call = jira.searchIssues(state.match.project, buildJQL(state.match.project, state.match.input))
    call.then((result) => {
        state.content.items = result;
        state.drawLayout();
    });
}

function buildJQL(project, value) {
    return `project = ${project.key.toUpperCase()} ${ value ? 'and text ~"' + value + '\"' : ''} order by created desc`;
}

function createSearchUrl(project, value) {
    return `${project.baseUrl}/issues/?jql=${escape(buildJQL(project, value))}`;
}