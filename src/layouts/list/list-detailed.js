const { shell } = require('electron');
const { loadTemplate } = require('../../utils');

const template = loadTemplate('src/layouts/list/list-detailed.html');

function build(data, link) {
    if (!data) return null;
    let doc = template.cloneNode(true);
    if (link) {
        doc.querySelector('.details__summary--linked-key').classList.remove('hide');
        doc.querySelector('.details__summary--linked-key').innerHTML = link.key;
    }    
    doc.dataset.url = data.url;
    doc.querySelector('.issue__icon--priority').setAttribute('src', data.priority.icon);
    doc.querySelector('.issue__icon--issuetype').setAttribute('src', data.issueType.icon);
    doc.querySelector('.details__summary--key').innerHTML = data.key ? data.key : '-';
    doc.querySelector('.details__title').innerHTML = data.summary ? data.summary : '-';
    // issue.querySelector('.issue__content--status').innerHTML = data.status.name;
    doc.querySelector('.details__sub--assignee').innerHTML = data.assignee ? data.assignee.name : '-';
    doc.querySelector('.details__sub--sprint').innerHTML = data.sprint ? data.sprint.name : '-';
    doc.addEventListener('click', () => {
        shell.openExternal(data.url, { activate: true });
    });

    console.debug(doc);

    return doc;
}

module.exports = { build };
