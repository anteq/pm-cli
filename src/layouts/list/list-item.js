const { shell } = require('electron');
const { loadTemplate } = require('../../utils');

const template = loadTemplate('src/layouts/list/list-item.html');

function build(data, isSelected) {
    if (!data) return null;
    let issue = template.cloneNode(true);
    console.debug(issue);
    
    issue.removeAttribute('id');
    if (isSelected) issue.classList.add('selected');
    issue.dataset.url = data.url;
    issue.querySelector('.issue__icon--priority').setAttribute('src', data.priority.icon);
    issue.querySelector('.issue__icon--issuetype').setAttribute('src', data.issueType.icon);
    issue.querySelector('.issue__content--key').innerHTML = data.key ? data.key : '-';
    issue.querySelector('.issue__content--key').classList.add(data.status.name.replace(' ', '-').toLowerCase());
    issue.querySelector('.issue__content--summary').innerHTML = data.summary ? data.summary : '-';
    issue.querySelector('.issue__content--status').innerHTML = data.status.name;
    issue.querySelector('.issue__content--status').classList.add(data.status.color);
    issue.querySelector('.issue__content--assignee').innerHTML = data.assignee ? data.assignee.name : '-';
    issue.querySelector('.issue__content--sprint').innerHTML = data.sprint ? data.sprint.name : '-';
    issue.addEventListener('click', () => {
        shell.openExternal(data.url, { activate: true });
    });
    return issue;
}

module.exports = { build };
