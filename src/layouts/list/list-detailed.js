const { shell } = require('electron');
const { loadTemplate } = require('../../utils');

const template = loadTemplate('src/layouts/list/list-detailed.html');

function build(state) {
    if (!state.content.details) return null;
    // let issue = template.cloneNode(true);
    return document.createTextNode('<span>'+ JSON.stringify(state.content.details) + '</span>');
}

module.exports = { build };
