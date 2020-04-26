const { loadTemplate } = require('../../utils');

const config = {
    key: 'hero',
    template: loadTemplate('src/layouts/hero/hero.html'),
    resolve: resolveHero
};
module.exports = config;

function resolveHero(data) {
    let { text, icon } = data;
    let doc = config.template.cloneNode(true);
    if (data.text) {
        doc.querySelector('.hero-layout__description').innerHTML = text || '';
        doc.querySelector('.hero-layout__icon').innerHTML = icon || '';
    }
    return doc;
}