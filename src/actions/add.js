const { reporter, people, defaults } = require('../config');
const { issueTypes, priorities } = require('../constants');
const { wrap } = require('../wrap');

module.exports = {
    key: 'add',
    name: 'Create new issue',
    triggers: ['{project} new', '{project} create', '{project} add'],
    arguments: true,
    resolve: resolveAdd
};

function resolveAdd(context, value) {
    var props = [];
    let arguments = parseArguments(value);
    addProject(context.project, props);
    addReporter(reporter, props);
    addAssignee(arguments.properties, props);
    addPriority(arguments.properties, props);
    addIssueType(arguments.properties, props);
    addSummary(arguments.summary, props);
    return {
        url: buildUrl(props, context),
        text: buildText(props)
    };
}

function buildUrl(props, context) {
    return `${context.project.baseUrl}/secure/CreateIssueDetails!init.jspa?${props.length ? props.map(x => `${x.jiraKey}=${x.value}`).join('&') : ''}`
}

function buildText(props) {
    let issuetype = props.find(x => x.key === 'issuetype');
    let project = props.find(x => x.key === 'project');
    let assignee = props.find(x => x.key === 'assignee');
    let priority = props.find(x => x.key === 'priority');
    return wrap(`Create new ${priority && priority.name !== 'Major' ? '{priority}' : ''} {issuetype} in {project} ${assignee ? 'for {assignee}' : ''}`,
    { issuetype: issuetype.name, project: project.name, priority: priority.name, assignee: assignee ? assignee.name : null });
}

function parseArguments(input) {
    var properties, summary;
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

function addProject(project, props) {
    if (project) {
        props.push({
            key: 'project',
            jiraKey: 'pid',
            value: project.jiraId,
            name: project.name
        });
    } else {
        throw new Error(`Project ${project.key} is not defined.`);
    }
}

function addReporter(reporter, props) {
    const user = people.find(x => x.key === reporter);
    if (user) {
        props.push({
            key: 'reporter',
            jiraKey: 'reporter',
            value: user.jiraId,
            name: user.name
        });
    } else {
        throw new Error(`User ${reporter} is not defined and cannot be a reporter.`);
    }
}

function addSummary(summary, props) {
    if (summary) {
        const formatted = summary.join("").replace(/\"/g, "");
        props.push({
            key: 'summary',
            jiraKey: 'summary',
            value: formatted,
            name: formatted
        });
    }
}

function addAssignee(values, props) {
    addGenericValue('assignee', people, values, props);
}

function addIssueType(values, props) {
    addGenericValue('issuetype', issueTypes, values, props);
}

function addPriority(values, props) {
    addGenericValue('priority', priorities, values, props);
}

function addGenericValue(genericValueKey, availableGenericValues, values, props) {
    var toBeAdded;
    for (let candidate of availableGenericValues) {
        let triggers = [...(candidate.triggers || []), candidate.key];
        let matchFound = triggers.map(trigger => values.includes(trigger)).reduce((a, b) => a || b);
        if (matchFound) {
            toBeAdded = {
                key: genericValueKey,
                jiraKey: genericValueKey,
                value: candidate.jiraId,
                name: candidate.name
            };
            break;
        }
    }
    if (!toBeAdded && defaults[genericValueKey]) {
        let match = availableGenericValues.find(x => x.key === defaults[genericValueKey]);
        toBeAdded = {
            key: genericValueKey,
            jiraKey: genericValueKey,
            value: match.jiraId,
            name: match.name
        };
    }
    if (toBeAdded) {
        props.push(toBeAdded);
    }
}
