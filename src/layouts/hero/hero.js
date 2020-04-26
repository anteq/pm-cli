const { loadTemplate } = require('../../utils');
const { shell } = require('electron');

const config = {
    key: 'hero',
    template: loadTemplate('src/layouts/hero/hero.html'),
    resolve: resolveHero,
    onKeyDown: (state, e) => {
        if (e.key === 'Enter') {
            shell.openExternal(state.content.url, { activate: true });
        }
    }
};
module.exports = config;

function resolveHero(data) {
    console.debug('hero', data);
    let { text, icon } = data.content;
    let doc = config.template.cloneNode(true);
    if (text) {
        doc.querySelector('.hero-layout__description').innerHTML = text || '';
        doc.querySelector('.hero-layout__icon').innerHTML = icon || '';
    }
    return doc;
}