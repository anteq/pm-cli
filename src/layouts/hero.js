const path = require('path');
const fs = require('fs');

const config = {
    key: 'hero',
    template: fs.readFileSync('src/layouts/hero.html', 'utf8'),
    resolve: resolveHero
};
module.exports = config;

function resolveHero(data) {
    let { text, icon } = data;
    let parser = new DOMParser();
    let doc = parser.parseFromString(config.template, 'text/html');
    if (data.text) {
        doc.querySelector('.hero-layout__description').innerHTML = text || '';
        doc.querySelector('.hero-layout__icon').innerHTML = icon || '';
    }
    return doc.querySelector('body').childNodes[0];
}