const fs = require('fs');
const parser = new DOMParser();
const spinner = parser.parseFromString('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>', 'text/html').childNodes[0];

function loadTemplate(uri) {
    let file = fs.readFileSync(uri, 'utf8');
    let doc = parser.parseFromString(file, 'text/html');
    return doc.querySelector('body').childNodes[0];
}

function emptyNode(doc, selector) {
    doc.querySelector(selector).innerHTML = '';
}

function setLoading(doc, selector) {
    doc.querySelector(selector).appendChild(spinner);
}

function appendChild(doc, selector, node) {
    if (node) {
        doc.querySelector(selector).appendChild(node);
    }
}

module.exports = { loadTemplate, emptyNode, appendChild };