const { shell } = require('electron');
const { loadTemplate } = require('../../utils');

const template = loadTemplate('src/layouts/list/list-detailed.html');

function build(data, github, link) {
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
    doc.querySelector('.details__summary--key').classList.add(data.status.name.replace(' ', '-').toLowerCase());
    doc.querySelector('.details__summary--status').innerHTML = data.status.name;
    doc.querySelector('.details__summary--status').classList.add(data.status.color);
    doc.querySelector('.details__title').innerHTML = data.summary ? data.summary : '-';
    doc.querySelector('.details__sub--assignee').innerHTML = data.assignee ? data.assignee.name : '-';
    doc.querySelector('.details__sub--reporter').innerHTML = data.reporter ? data.reporter.name : '-'
    doc.querySelector('.details__sub--reported').innerHTML = data.created ? data.created.fromNow() : '-';
    doc.querySelector('.details__sub--sprint').innerHTML = data.sprint ? data.sprint.name : '-';
    if (data.comments) {
        let comment = data.comments[0];
        doc.querySelector('.comment').classList.remove('hide');
        doc.querySelector('.details__sub--comment-body').innerHTML = comment ? comment.text : '-';
        doc.querySelector('.details__sub--comment-author').innerHTML = comment ? comment.author.name : '-';
        doc.querySelector('.details__sub--comment-date').innerHTML = comment ? comment.created.fromNow() : '-';
    }
    doc.addEventListener('click', () => {
        shell.openExternal(data.url, { activate: true });
    });
    if (github && github.prs) {
        for (let pr of github.prs) {
            let temp = doc.querySelector('.pr').cloneNode(true);
            temp.classList.remove('hide');
            temp.querySelector('.pr__header--title').innerHTML = pr.id + ' ' + pr.name;
            temp.querySelector('.pr__header--sub').innerHTML = pr.updated.fromNow();
            temp.querySelector('.pr__header--status').innerHTML = pr.status;
            if (pr.url.includes('tm-webapp') && !('merged', 'closed').includes(pr.status.toLowerCase())) {
                temp.querySelector('.pr__links').classList.remove('hide');
                temp.querySelector('.pr__links--app').setAttribute('href', `https://${data.key}-app.tagger.dev`);
                temp.querySelector('.pr__links--creator').setAttribute('href', `https://${data.key}-creator.tagger.dev`);
                temp.querySelector('.pr__links--collaborator').setAttribute('href', `https://${data.key}-collaborator.tagger.dev`);
            }
            addEventListener('click', () => {
                shell.openExternal(pr.url, { activate: true });
            });
            doc.appendChild(temp);
        }
    }

    console.debug(doc);

    return doc;
}

module.exports = { build };
