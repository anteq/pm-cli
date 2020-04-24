const { wrap } = require('../wrap');

const config = {
    key: 'openCustom',
    name: 'Open Custom URL',
    icon: '🌐',
    context: 'custom',
    triggers: ['{custom}'],
    arguments: false,
    layout: 'hero',
    resolve: resolveCustom
};
module.exports = config;

function resolveCustom(context, value) {
    return {
        url: context.custom.url,
        action: config,
        content: {
            text: wrap(`Open {custom}`, { custom: context.custom.name }),
            icon: config.icon
        }
    };
}