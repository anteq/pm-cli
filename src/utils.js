const { remote, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const parser = new DOMParser();
const spinner = parser.parseFromString('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>', 'text/html').childNodes[0];

function loadTemplate(uri) {
    return {
        load: () => {
            let file = fs.readFileSync(path.join(remote.getGlobal('assetPath'), uri), 'utf8');
            let doc = parser.parseFromString(file, 'text/html');
            return doc.querySelector('body').childNodes[0];
        }
    };
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

function cartesian(a, b, ...c) {
    if (!b) return a.map(x => [x]);
    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    const cart = (a, b, ...c) => (b ? cart(f(a, b), ...c) : a);
    const final = cart(a, b, ...c)
    return final;
}

function openUrl(url) {
    if (url) {
        shell.openExternal(url, { activate: true });
    }
}

module.exports = { loadTemplate, emptyNode, appendChild, setLoading, cartesian, openUrl };