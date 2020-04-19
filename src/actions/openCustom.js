const { custom } = require('../config');
const { wrap } = require('../wrap');

module.exports = {
    key: 'openCustom',
    name: 'Open Custom URL',
    context: 'custom',
    triggers: ['{custom}'],
    arguments: false,
    resolve: resolveCustom
};

function resolveCustom(context, value) {
    return {
        url: context.custom.url,
        text: wrap(`Open {custom}`, { custom: context.custom.name })
    };
}