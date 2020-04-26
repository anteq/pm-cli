const path = require('path');
const { shell } = require('electron');
const fs = require('fs');
const jira = require('../connectors/jira');

const config = {
    key: 'list',
    template: fs.readFileSync('src/layouts/list.html', 'utf8'),
    onKeyDown: onKeyDown,
    resolve: resolveList
};
module.exports = config;

function onKeyDown(state, e) {
    if (e.keyCode == '38') {
        state.content.selectedIndex -= 1;
        state.content.details = null;
        state.drawLayout();
    }
    else if (e.keyCode == '40') {
        state.content.selectedIndex += 1;
        state.content.details = null;
        state.drawLayout();
    }
}

function getDetails(state, issue) {
    setTimeout(() => {
        // todo fix base url - get from config
        jira.getIssue({project: {baseUrl: 'https://scalaric.atlassian.net'}}, issue.key).then((result) => { 
            state.content.details = result;
            state.drawLayout();
        });
        jira.getGithubInfo({project: {baseUrl: 'https://scalaric.atlassian.net'}}, issue.id).then(result => {
            console.debug('gh info', result);
        });
        if (issue.links) {
            jira.getIssues({project: {baseUrl: 'https://scalaric.atlassian.net'}}, issue.links.map(x => x.issue)).then(result => {
                console.debug('links info', result);
            });
        }
    })
}

function resolveList(state, _selectedIndex) {
    console.debug('drawing!', state);
    let parser = new DOMParser();
    let selectedIndex = _selectedIndex || 0;
    let doc = parser.parseFromString(config.template, 'text/html');
    if (!state.content.details) {
        state.content.selectedIndex = selectedIndex;
        getDetails(state, state.content.items[state.content.selectedIndex]);
    }
    if (state.content.items) {
        let issueTemplate = doc.querySelector('#issue-template');
        for (let i in state.content.items) {
            doc.querySelector('.column-layout__left').appendChild(createIssueHTML(issueTemplate, state.content.items[i], i == state.content.selectedIndex));
        }
    }
    if (state.content.details) {
        doc.querySelector('.column-layout__right').innerHTML = '<h1>' + state.content.details.key + '</h1>';
    }
    console.debug('html', doc.querySelector('body').childNodes[0]);
    return doc.querySelector('body').childNodes[0];
}

function createIssueHTML(template, data, isSelected) {
    if (!data) return null;
    let issue = template.cloneNode(true);
    issue.removeAttribute('id');
    issue.classList.remove('hide');
    if (isSelected) issue.classList.add('selected');
    issue.dataset.url = data.url;
    issue.querySelector('.issue__icon--priority').setAttribute('src', data.priority.icon);
    issue.querySelector('.issue__icon--issuetype').setAttribute('src', data.issueType.icon);
    issue.querySelector('.issue__content--key').innerHTML = data.key ? data.key : '-';
    issue.querySelector('.issue__content--summary').innerHTML = data.summary ? data.summary : '-';
    // issue.querySelector('.issue__content--status').innerHTML = data.status.name;
    issue.querySelector('.issue__content--assignee').innerHTML = data.assignee ? data.assignee.name : '-';
    issue.querySelector('.issue__content--sprint').innerHTML = data.sprint ? data.sprint.name : '-';
    issue.addEventListener('click', () => {
        shell.openExternal(data.url, { activate: true });
    });
    return issue;
  }