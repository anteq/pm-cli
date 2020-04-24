const path = require('path');
const fs = require('fs');

const config = {
    key: 'list',
    template: fs.readFileSync('src/layouts/list.html', 'utf8'),
    resolve: resolveList
};
module.exports = config;

function resolveList(data) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(config.template, 'text/html');
    if (data.items) {
        let issueTemplate = doc.querySelector('#issue-template');
        for (let issue of data.items) {
            doc.querySelector('.column-layout__left').appendChild(createIssueHTML(issueTemplate, issue));
        }
    }
    return doc.querySelector('body').childNodes[0];
}

function createIssueHTML(template, data) {
    if (!data) return null;
    let issue = template.cloneNode(true);
    issue.removeAttribute('id');
    issue.classList.remove('hide');
    issue.querySelector('.issue__icon--priority').setAttribute('src', data.priority.icon);
    issue.querySelector('.issue__icon--issuetype').setAttribute('src', data.issueType.icon);
    issue.querySelector('.issue__content--key').innerHTML = data.key ? data.key : '-';
    issue.querySelector('.issue__content--summary').innerHTML = data.summary ? data.summary : '-';
    // issue.querySelector('.issue__content--status').innerHTML = data.status.name;
    issue.querySelector('.issue__content--assignee').innerHTML = data.assignee ? data.assignee.name : '-';
    issue.querySelector('.issue__content--sprint').innerHTML = data.sprint ? data.sprint.name : '-';
    return issue;
  }