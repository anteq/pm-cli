const { wrap } = require('../wrap');

const config = {
    key: 'openCustom',
    name: 'Open Custom URL',
    icon: '🌐',
    triggers: ['{custom}'],
    arguments: false,
    layout: 'hero',
    resolve: resolveCustom
};
module.exports = config;

function resolveCustom(state) {
    return {
        url: state.match.custom.url,
        text: wrap(`Open {custom}`, { custom: state.match.custom.name }),
        icon: config.icon
    };
}