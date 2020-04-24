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

async function resolveOpen(context, value) {
    const no = parseInt(value);
    const issue = context.project.key.toUpperCase() + (isNaN(no) ? '' : `-${no}`)
    let data;
    await jira.getIssue(context, issue).then(
        (result) => {
            data = result;
        }, (error) => {
            console.error('err', error);
        }
    );
    return {
        url: `${context.project.baseUrl}/browse/${issue}`,
        text: wrap(`Open {issue}`, {issue}),
        issues: [data],
        action: config
    };
}