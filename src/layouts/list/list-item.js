const { loadTemplate } = require('../../utils');
const { findAndFill } = require('../filler');

const template = loadTemplate('src/layouts/list/list-item.html');

function build(i, state) {
    let data = state.content.items[i];
    if (!data) return null;
    let isSelected = i == state.content.selectedIndex;

    let issue = template.load().cloneNode(true);
    
    issue.removeAttribute('id');
    if (isSelected) issue.classList.add('selected');
    issue.dataset.url = data.url;
    findAndFill(issue, {
        issue: data
    });
    issue.addEventListener('click', () => {
        // TODO: fix saving scroll
        state.content.selectedIndex = i;
        state.content.details = null;
        state.drawLayout();
        // shell.openExternal(data.url, { activate: true });
    });
    return issue;
}

module.exports = { build };
