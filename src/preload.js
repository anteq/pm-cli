const { remote, shell } = require('electron');
const { parseInput } = require('./parser');

function main() {
  var result;
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.input-search').focus();
    if (remote.getGlobal('darkMode')) {
      document.querySelector('.content').classList.add('dark');
    }
  });
  window.addEventListener('keyup', (e) => {
    parseInput(document.querySelector('.input-search').value).then(r => {
      if (r) {
        let { result, input } = r;
        if (document.querySelector('.input-search').value !== input) return;
        if (result.action.layout) {
          document.querySelector('.content').classList.remove('hide-main');
          if (result.action.layout === 'hero') {
            document.querySelector('.hero-layout').classList.remove('hide');
            document.querySelector('.column-layout').classList.add('hide');
            if (result.text) {
              document.querySelector('.hero-layout__description').innerHTML = result ? result.text : '';
              document.querySelector('.hero-layout__icon').innerHTML = result ? result.action.icon : '';
            }
          } else if (result.action.layout === 'list') {
            document.querySelector('.hero-layout').classList.add('hide');
            document.querySelector('.column-layout').classList.remove('hide');
            if (result.issues) {
              document.querySelector('.column-layout__left').innerHTML = '';
              document.querySelector('.column-layout__right').innerHTML = '';
              for (let issue of result.issues) {
                document.querySelector('.column-layout__left').appendChild(createIssueHTML(issue));
              }
            }
          }
        } 
      } else {
        document.querySelector('.content').classList.add('hide-main');
      }
    });
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && result && result.url) shell.openExternal(result.url, { activate: true });
    if (e.keyCode == '27') remote.getCurrentWindow().close();
  });
};

function createIssueHTML(data) {
  if (!data) return null;
  let issue = document.querySelector('#issue-template').cloneNode(true);
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

main();