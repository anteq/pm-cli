const { api } = require('../config');
const request = require('request');

const options = {
    json: true,
    headers: {
        'Authorization': 'Basic ' + Buffer.from(api.jira.login + ":" + api.jira.key).toString("base64")
    }
};

function getIssue(context, issue) {
    const url = `${context.project.baseUrl}/rest/api/2/issue/${issue}`;
    return get(url).then(response => {
        return buildIssue(response);
    });
}

function searchIssues(context, jql) {
    const url = `${context.project.baseUrl}/rest/api/2/search?jql=${escape(jql)}&maxResults=10`;
    return get(url).then(response => {
        return response.issues.map(r => buildIssue(r));
    });
}

let getRequest;
function get(url) {
    if (getRequest) getRequest.abort();
    return new Promise((resolve, reject) => {
        getRequest = request.get({ ...options, url }, (err, res, data) => {
            if (err) reject(err)
            else resolve(data);
        })
    });
}

function post(url, body, error, success) {
    return new Promise((resolve, reject) => {
        request.get({ ...options, url, body }, (err, res, data) => {
            if (err) reject(err)
            else resolve(data);
        })
    });
}

function buildIssue(response) {
    if (!response.fields) return null;
    return {
        key: response.key,
        issueType: buildIssueType(response.fields),
        priority: buildPriority(response.fields),
        status: buildStatus(response.fields),
        assignee: buildAssignee(response.fields),
        sprint: buildSprint(response.fields),
        github: buildGithub(response.fields),
        links: buildLinks(response.fields),
        summary: response.fields.summary
    };
}

function buildIssueType(fields) {
    return {
        name: fields.issuetype.name,
        icon: fields.issuetype.iconUrl
    };
}

function buildPriority(fields) {
    return {
        name: fields.priority.name,
        icon: fields.priority.iconUrl
    };
}

function buildStatus(fields) {
    return {
        name: fields.status.name,
        icon: fields.status.iconUrl
    };
}

function buildAssignee(fields) {
    return {
        name: fields.assignee ? fields.assignee.displayName : 'Unassigned',
        id: fields.assignee ? fields.assignee.accountId : null,
        img: fields.assignee ? fields.assignee.avatarUrls['48x48'] : null
    };
}

function buildSprint(fields) {
    let data = fields.customfield_10000;
    if (!data || !data.length) return null;
    let matchName = data[0].match(/name=(.*?),/);
    let matchId = data[0].match(/id=(.*?),/);
    return {
        name: matchName ? matchName[1] : null,
        id: matchId ? matchId[1] : null
    };
}

function buildGithub(fields) {
    let data = fields.customfield_10500;
    if (!data) return null;
    return {
        state: data.includes("MERGED") ? "MERGED" : null
    };
}

function buildLinks(fields) {
    let data = fields.issuelinks;
    if (!data || !data.length) return null;
    return data.map(x => buildLink(x));
}

function buildLink(link) {
    let direction = link.outwardIssue ? 'outward' : 'inward';
    let issue = direction === 'outward' ? link.outwardIssue : link.inwardIssue;
    return {
        direction,
        name: link.type[direction],
        issue: {
            key: issue.key,
            summary: issue.fields.summary,
            status: buildStatus(issue.fields),
            priority: buildPriority(issue.fields),
            issuetype: buildIssueType(issue.fields)
        }
    };
}

module.exports = { getIssue, searchIssues };