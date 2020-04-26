const { wrap } = require('../wrap');
const jira = require('../connectors/jira');

const config = {
    key: 'openIssue',
    name: 'Open issue by code',
    icon: '🚪',
    context: 'project',
    triggers: ['{project}-'],
    arguments: true,
    layout: 'list',
    resolve: resolveOpen
};
module.exports = config;

function resolveOpen(state) {
    const no = parseInt(state.match.input);
    const issue = project.key.toUpperCase() + (isNaN(no) ? '' : `-${no}`)
    setTimeout(() => { callGetIssue(state, issue); })
    return {
        url: `${state.match.project.baseUrl}/browse/${issue}`,
        content: {
            text: wrap(`Open {issue}`, {issue})
        }        
    };
}

function callGetIssue(state, issue) {
    jira.getIssue(state.match.project, issue).then(
        (result) => {
            state.content.items = [result];
            state.drawLayout();
        }
    );
}