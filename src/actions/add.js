const { reporter, people } = require('../config');
const { issueTypes, priorities } = require('../constants');

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
        url: `${context.project.baseUrl}/secure/CreateIssueDetails!init.jspa?${props.join('&')}`,
        text: 'Add new issue'
    };
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
        props.push(`pid=${project.jiraId}`);
    } else {
        throw new Error(`Project ${project.key} is not defined.`);
    }
}

function addReporter(reporter, props) {
    const user = people.find(x => x.key === reporter);
    if (user) {
        props.push(`reporter=${user.jiraId}`);
    } else {
        throw new Error(`User ${reporter} is not defined and cannot be a reporter.`);
    }
}

function addSummary(summary, props) {
    if (summary) {
        const formatted = summary.join("").replace(/\"/g, "");
        props.push(`summary=${formatted}`);
    }
}

function addAssignee(values, props) {
    for (let candidate of people) {
        let triggers = [...(candidate.triggers || []), candidate.key];
        let matchFound = triggers.map(trigger => values.includes(trigger)).reduce((a, b) => a || b);
        if (matchFound) {
            props.push(`assignee=${candidate.jiraId}`);
            break;
        }
    }
}

function addIssueType(values, props) {
    for (let candidate of issueTypes) {
        let triggers = [...(candidate.triggers || []), candidate.key];
        let matchFound = triggers.map(trigger => values.includes(trigger)).reduce((a, b) => a || b);
        if (matchFound) {
            props.push(`issuetype=${candidate.jiraId}`);
            break;
        }
    }
}

function addPriority(values, props) {
    for (let candidate of priorities) {
        let triggers = [...(candidate.triggers || []), candidate.key];
        let matchFound = triggers.map(trigger => values.includes(trigger)).reduce((a, b) => a || b);
        if (matchFound) {
            props.push(`priority=${candidate.jiraId}`);
            break;
        }
    }
}
