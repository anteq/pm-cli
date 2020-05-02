const { api } = require('../config');
const rest = require('../rest');
const { fields, buildGithubInfo, buildIssue } = require('./jiraData');

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
    const url = `${project.baseUrl}/rest/api/2/search?jql=${escape(jql)}&fields=${fields.join(',')}`;
    return get(url).then(response => {
        return response.data.issues.map(r => buildIssue(r, project.baseUrl));
    });
}

function getCurrentSprint(project, developer) {
    // developer: optional
    const jql = `project = "${project.key}" and sprint in openSprints() and status != "Done" ${developer ? 'and assignee = ' + developer.jiraId + ' ' : ''} order by rank asc`
    const url = `${project.baseUrl}/rest/api/2/search?jql=${escape(jql)}&maxResults=100`;
    return rest.all([get(url), get(url + '&startAt=100')]).then(response => {
        // todo: handle more and handle nicer
        let p1 = response[0].data.issues.map(r => buildIssue(r, project.baseUrl));
        let p2 = response[1].data.issues.map(r => buildIssue(r, project.baseUrl));
        return [...p1, ...p2];
    });
}

function searchIssues(project, jql) {
    const url = `${project.baseUrl}/rest/api/2/search?jql=${escape(jql)}&maxResults=50&fields=${fields.join(',')}`;
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


module.exports = { getIssue, getIssues, searchIssues, getGithubInfo, getCurrentSprint };