const { shell } = require('electron');
const { loadTemplate } = require('../../utils');
const { findAndFill } = require('../filler');

const template = loadTemplate('src/layouts/list/list-item.html');

function build(data, isSelected) {
    if (!data) return null;
    let issue = template.cloneNode(true);
    
    issue.removeAttribute('id');
    if (isSelected) issue.classList.add('selected');
    issue.dataset.url = data.url;
    findAndFill(issue, {
        issue: data
    });
    issue.addEventListener('click', () => {
        shell.openExternal(data.url, { activate: true });
    });
    return issue;
}

module.exports = { build };
