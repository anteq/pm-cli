const { wrap } = require('../wrap');
const jira = require('../connectors/jira');

const config = {
    key: 'openIssue',
    name: 'Open issue by code',
    icon: '🚪',
    triggers: ['{project}-'],
    arguments: true,
    layout: 'list',
    resolve: resolveOpen
};
module.exports = config;

let call;

let cancel = function() {
    if (call) call.cancel();
}

function resolveOpen(state) {
    const no = parseInt(state.match.input);
    const issue = state.match.project.key.toUpperCase() + (isNaN(no) ? '' : `-${no}`)
    setTimeout(() => { callGetIssue(state, issue); })
    return {
        url: `${state.match.project.baseUrl}/browse/${issue}`,
        text: wrap(`Open {issue}`, {issue}),
        cancel: cancel   
    };
}

function callGetIssue(state, issue) {
    if (call) call.cancel();
    call = jira.getIssue(state.match.project, issue);
    call.then((result) => {
        state.content.items = [result];
        state.drawLayout();
    });
}