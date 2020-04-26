const fs = require('fs');
const parser = new DOMParser();

function loadTemplate(uri) {
    let file = fs.readFileSync(uri, 'utf8');
    let doc = parser.parseFromString(file, 'text/html');
    return doc.querySelector('body').childNodes[0];
}

module.exports = { loadTemplate };