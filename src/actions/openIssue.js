const { wrap } = require('../wrap');

module.exports = {
    key: 'openIssue',
    name: 'Open issue by code',
    context: 'project',
    triggers: ['{project}-'],
    arguments: true,
    resolve: resolveOpen
};

function resolveOpen(context, value) {
    const no = parseInt(value);
    const issue = context.project.key.toUpperCase() + (isNaN(no) ? '' : `-${no}`)
    return {
        url: `${context.project.baseUrl}/browse/${issue}`,
        text: wrap(`Open {issue}`, {issue})
    };
}