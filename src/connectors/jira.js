const { api } = require('../config');
const moment = require('moment');
const rest = require('../rest');

const auth = {
    'Authorization': 'Basic ' + Buffer.from(api.jira.login + ":" + api.jira.key).toString("base64")
};

function get(url) { 
    let call = rest.get(url, auth);
    return call;
}

function getIssue(project, issue) {
    const url = `${project.baseUrl}/rest/api/2/issue/${issue}`;
    return get(url).then(response => {
        return buildIssue(response.data, project.baseUrl);
    });
}

function getIssues(project, issues) {
    const jql = issues.map(x => `key = ${x.key}`).join(' OR ');
    const url = `${project.baseUrl}/rest/api/2/search?jql=${escape(jql)}`;
    return get(url).then(response => {
        return response.data.issues.map(r => buildIssue(r, project.baseUrl));
    });
}

function searchIssues(project, jql) {
    const url = `${project.baseUrl}/rest/api/2/search?jql=${escape(jql)}&maxResults=10`;
    const call = get(url).then(response => {
        return response.data.issues.map(r => buildIssue(r, project.baseUrl));
    });
    return call;
}

function getGithubInfo(project, issueId) {
    const url = `${project.baseUrl}/rest/dev-status/latest/issue/detail?issueId=${issueId}&applicationType=GitHub&dataType=branch`;
    return get(url).then(response => {
        return buildGithubInfo(response.data);
    });
}

function buildGithubInfo(response) {
    if (!response.detail[0]) return null;
    return {
        branches: buildBranches(response.detail[0]),
        prs: buildPrs(response.detail[0])
    }
}

function buildBranches(detail) {
    return detail.branches.map(x => {
        return {
            name: x.name,
            url: x.url,
            repository: x.repository.name,
            updated: moment(x.lastCommit.authorTimestamp),
            lastCommit: {
                id: x.lastCommit.id,
                author: x.lastCommit.author.name,
                url: x.lastCommit.url
            }
        };
    });
}

function buildPrs(detail) {
    return detail.pullRequests.map(x => {
        return {
            author: x.author.name,
            id: x.id,
            name: x.name,
            url: x.url,
            updated: moment(x.lastUpdate),
            status: x.status
        };
    });
}

function buildIssue(response, baseUrl) {
    if (!response.fields) return null;
    console.debug(response);
    return {
        url: `${baseUrl}/browse/${response.key}`,
        key: response.key,
        id: response.id,
        created: moment(response.fields.created),
        updated: moment(response.fields.modified),
        issueType: buildIssueType(response.fields),
        priority: buildPriority(response.fields),
        status: buildStatus(response.fields),
        reporter: buildReporter(response.fields),
        assignee: buildAssignee(response.fields),
        sprint: buildSprint(response.fields),
        github: buildGithub(response.fields),
        links: buildLinks(response.fields),
        comments: buildComments(response.fields),
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
        color: fields.status.statusCategory.colorName,
        name: fields.status.name
    };
}

function buildAssignee(fields) {
    return {
        name: fields.assignee ? fields.assignee.displayName : 'Unassigned',
        id: fields.assignee ? fields.assignee.accountId : null,
        img: fields.assignee ? fields.assignee.avatarUrls['48x48'] : null
    };
}

    
function buildReporter(fields) {
    return {
        name: fields.reporter ? fields.reporter.displayName : '-',
        id: fields.reporter ? fields.reporter.accountId : null,
        img: fields.reporter ? fields.reporter.avatarUrls['48x48'] : null
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

function buildComments(fields) {
    if (fields.comment) {
        return fields.comment.comments.map(x => {
            return {
                author: {
                    name: x.updateAuthor ? x.updateAuthor.displayName : 'Unknown',
                    id: x.updateAuthor ? x.updateAuthor.accountId : null,
                    img: x.updateAuthor ? x.updateAuthor.avatarUrls['48x48'] : null
                },
                text: x.body,
                created: moment(x.updated)
            };
        }).reverse();
    } else {
        return null;
    }
}

module.exports = { getIssue, getIssues, searchIssues, getGithubInfo };