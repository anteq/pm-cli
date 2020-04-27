const { shell } = require('electron');
const { loadTemplate } = require('../../utils');
const { findAndFill } = require('../filler');

const template = loadTemplate('src/layouts/list/list-detailed.html');

function build(data, github, link) {
    if (!data) return null;
    let doc = template.cloneNode(true);
    findAndFill(doc, {
        issue: data,
        linkedIssue: link
    });
    if (link) {
        doc.querySelector('.details__summary--linked-key').classList.remove('hide');
        doc.querySelector('.details__summary--linked-key').innerHTML = link.key;
    }    
    doc.dataset.url = data.url;
    doc.addEventListener('click', () => {
        shell.openExternal(data.url, { activate: true });
    });
    if (github && github.prs) {
        for (let pr of github.prs) {
            let temp = doc.querySelector('.pr').cloneNode(true);
            temp.classList.remove('hide');
            findAndFill(temp, {
                pr
            });
            // temp.querySelector('.pr__header--title').innerHTML = pr.id + ' ' + pr.name;
            // temp.querySelector('.pr__header--sub').innerHTML = pr.updated.fromNow();
            // temp.querySelector('.pr__header--status').innerHTML = pr.status;
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
