const { reporter, people, defaults } = require('../config');
const { issueTypes, priorities } = require('../constants');
const { wrap } = require('../wrap');

const config = {
    key: 'addIssue',
    name: 'Create new issue',
    icon: '🔖',
    context: 'project',
    triggers: ['{project} new', '{project} create', '{project} add'],
    arguments: true,
    resolve: resolveAdd
};
module.exports = config;

function resolveAdd(context, value) {
    let arguments = parseArguments(value);
    let props = [
        findProject(context.project),
        findReporter(reporter),
        findAssignee(arguments.properties),
        findPriority(arguments.properties),
        findIssueType(arguments.properties),
        ...findLink(arguments.properties),
        findSummary(arguments.summary)
    ].filter(x => !!x);
    return {
        url: buildUrl(props, context),
        text: buildText(props),
        icon: config.icon
    };
}

function buildUrl(props, context) {
    return `${context.project.baseUrl}/secure/CreateIssueDetails!init.jspa?${props.length ? props.map(x => `${x.jiraKey}=${x.value}`).join('&') : ''}`;
}

function buildText(props) {
    let issuetype = props.find(x => x.key === 'issuetype');
    let project = props.find(x => x.key === 'project');
    let assignee = props.find(x => x.key === 'assignee');
    let priority = props.find(x => x.key === 'priority');
    let link = props.find(x => x.key === 'link-issue');
    return wrap(`Create new {issuetype} in {project} ${assignee ? 'for {assignee}' : ''} ${link ? ' 🔗{link}' : ''}`,
    { issuetype: issuetype.name, project: project.name, priority: priority.name, assignee: assignee ? assignee.name : null, link: link ? link.name.toUpperCase() : null });
}

function parseArguments(_input) {
    var properties, summary;
    let input = _input.replace("link ", "link=");
    const summaryRegex = /\"(.*)\"/gim;
    const match = input.match(summaryRegex);
    if (match) {
        const index = input.indexOf(match);
        properties = input.slice(0, index).toLowerCase().split(" ");
        summary = match;
    } else {
        properties = input.toLowerCase().split(" ");
    }
    return { properties, summary };
}

function findProject(project) {
    return project ? {
        key: 'project',
        jiraKey: 'pid',
        value: project.jiraId,
        name: project.key.toUpperCase()
    } : null;
}

function findReporter(reporter) {
    const user = people.find(x => x.key === reporter);
    return user ? {
        key: 'reporter',
        jiraKey: 'reporter',
        value: user.jiraId,
        name: user.name
    } : null;
}

function findSummary(summary) {
    const formatted = summary ? summary.join("").replace(/\"/g, "") : null;
    return formatted ? {
        key: 'summary',
        jiraKey: 'summary',
        value: formatted,
        name: formatted
    } : null;
}

function findLink(inputs) {
    let possibleLinks = inputs.filter(x => x.startsWith("link="));
    if (possibleLinks.length) {
        let link = possibleLinks[0].slice(5);
        return [{
            key: 'link-issue',
            jiraKey: 'issuelinks-issues',
            value: link.toUpperCase(),
            name: link.toUpperCase()
        }, {
            key: 'link-type',
            jiraKey: 'issuelinks-linktype',
            value: 'described in',
            name: 'Described in'
        }];
    }
    return [];
}

function findAssignee(inputs) {
    return findGenericJiraValue('assignee', people, inputs);
}

function findIssueType(inputs) {
    return findGenericJiraValue('issuetype', issueTypes, inputs);
}

function findPriority(inputs) {
    return findGenericJiraValue('priority', priorities, inputs);
}

function findGenericJiraValue(jiraKey, jiraValues, inputs) {
    var toBeAdded;
    for (let candidate of jiraValues) {
        let triggers = [...(candidate.triggers || []), candidate.key];
        let matchFound = triggers.map(trigger => inputs.includes(trigger)).reduce((a, b) => a || b);
        if (matchFound) {
            toBeAdded = candidate;
            break;
        }
    }
    toBeAdded = toBeAdded || (defaults[jiraKey] ? jiraValues.find(x => x.key === defaults[jiraKey]) : null);
    return toBeAdded ? {
        key: jiraKey,
        jiraKey: jiraKey,
        value: toBeAdded.jiraId,
        name: toBeAdded.name
    } : null;
}
