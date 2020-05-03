const jira = require('../connectors/jira');

const config = {
    key: 'openDev',
    name: 'Search issues by developer',
    icon: '🔍',
    triggers: ['{project} {person}'],
    arguments: false,
    layout: 'list',
    resolve: resolveSearch
};
module.exports = config;

let call;

let cancel = function() {
    if (call) call.cancel();
}

function resolveSearch(state) {
    setTimeout(() => callSearch(state));
    return {
        url: createSearchUrl(state.match.project, state.match.input),
        cancel
    };
}

function callSearch(state) {
    if (call) call.cancel();
    call = jira.getCurrentSprint(state.match.project, state.match.person);
    call.then((result) => {
        state.content.items = result;
        state.drawLayout();
    });
}

function buildJQL(project, assignee, value) {
    return `project = ${project.key.toUpperCase()} and assignee = ${assignee.jiraId} ${ value ? 'and text ~"' + value + '\"' : ''} order by rank desc`;
}

function createSearchUrl(project, value) {
    return `${project.baseUrl}/issues/?jql=${escape(buildJQL(project, value))}`;
}