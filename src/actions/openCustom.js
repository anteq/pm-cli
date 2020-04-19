const { wrap } = require('../wrap');

const config = {
    key: 'openCustom',
    name: 'Open Custom URL',
    icon: '🌐',
    context: 'custom',
    triggers: ['{custom}'],
    arguments: false,
    resolve: resolveCustom
};
module.exports = config;

function resolveCustom(context, value) {
    return {
        url: context.custom.url,
        text: wrap(`Open {custom}`, { custom: context.custom.name }),
        icon: config.icon
    };
}