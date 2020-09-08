const moment = require('moment');
const { people } = require('../config');

const fields = ['created', 'modified', 'id', 'issuetype', 'key', 'priority', 'status', 'reporter', 'assignee', 'sprint', 'issuelinks', 'summary', 'comment', 'customfield_10500'];

module.exports = { buildGithubInfo, buildIssue, fields };

function buildGithubInfo(response) {
    if (!response.detail[0]) return null;
    return {
        branches: buildBranches(response.detail[0]),
        prs: buildPrs(response.detail[0])
    }
}

function buildIssue(response, baseUrl) {
    if (!response.fields) return null;
    return {
        url: `${baseUrl}/browse/${response.key}`,
        key: response.key,
        id: response.id,
        created: moment(response.fields.created),
        updated: moment(response.fields.modified),
        issuetype: buildIssueType(response.fields),
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

function buildBranches(detail) {
    if (!detail.branches || !detail.branches.length) return null;
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
    if (!detail.pullRequests || !detail.pullRequests.length) return null;
    return detail.pullRequests.map(x => {
        return {
            author: x.author.name,
            id: x.id.replace('#', ''),
            name: x.name,
            url: x.url,
            repo: x.url.replace('https://github.com/', '').replace(/\/pull.*$/, ''),
            updated: moment(x.lastUpdate),
            status: x.status
        };
    });
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
        category: fields.status.statusCategory.name,
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
    let last = data[data.length - 1];
    return {
        name: last ? last.name : null,
        id: last ? last.id : null
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
    // todo order by: first other project and first those with PRs
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
            issuetype: buildIssueType(issue.fields),
            id: issue.id
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
                text: parsePeopleInText(x.body),
                created: moment(x.updated)
            };
        }).reverse();
    } else {
        return null;
    }
}

function parsePeopleInText(body) {
    for (let person of people) {
        body = body.replace(`[~accountid:${person.jiraId}]`, '@' + person.name);
    }
    body = body.replace(/\[\~accountid\:.*\]/g, '@User')
    return body;
}