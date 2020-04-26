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

async function resolveOpen(state) {
    const no = parseInt(state.match.input);
    console.debug(state);
    const project = state.match.project;
    const issue = project.key.toUpperCase() + (isNaN(no) ? '' : `-${no}`)
    let data;
    await jira.getIssue(project, issue).then(
        (result) => {
            data = result;
        }, (error) => {
            console.error('err', error);
        }
    );
    return {
        url: `${project.baseUrl}/browse/${issue}`,
        content: {
            text: wrap(`Open {issue}`, {issue}),
            items: [data]
        }        
    };
}