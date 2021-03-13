const { actions } = require('./actions');
const config = require('./config');
const { cartesian } = require('./utils');

module.exports = { parse, init };

let search;

function getActionContexts(triggers) {
    let definition = triggers.join(" ");
    return [...new Set(Array.from(definition.matchAll(/\{(.*?)\}/gi)).map(x => x[1]))];
}

function getPossibleValues(slugs) {
    return slugs.map(slug => {
        return config[config.slugs.find(s => s.slug === slug).values].map( configItem => {
            return {
                slug,
                value: configItem
            };
        });
    });
}

function configureSearch() {
    var regexps = [];
    for (let action of actions) {
        let slugs = getActionContexts(action.triggers);
        let valuesPerEachSlug = getPossibleValues(slugs);
        let valuesCombined = cartesian(...valuesPerEachSlug);
        for (let option of valuesCombined) {
            pushTriggerRegexps(action, option, regexps)
        }
    }
    return regexps;
}

function pushTriggerRegexps(action, optionConfig, regexps) {
    // optionConfig: [{ slug: string, value: [ key: string, ... ] }]
    for (let trigger of action.triggers) {
        var regexObject = { action };
        var regexString = trigger;
        for (let valueToBeReplaced of optionConfig) {
            regexObject[valueToBeReplaced.slug] = valueToBeReplaced.value;
            let values = [valueToBeReplaced.value.key, ...valueToBeReplaced.value.triggers ? valueToBeReplaced.value.triggers : []];
            regexString = regexString.replace(`{${valueToBeReplaced.slug}}`, values.length > 1 ? ('(' + values.join('|') + ')') : values[0] );
        }
        regexObject['regexp'] = new RegExp('^' + regexString + '(.*)', 'i');
        regexps.push(regexObject);
    }
}

function init() {
    search = configureSearch();
}

function parse(raw) {
    if (!search) throw new Error('Parser not initialized');
    for (let action of search) {
        const match = raw.match(action.regexp);
        if (match) {
            const index = match[1] === "" ? match[0].length : raw.indexOf(match[1]);
            return { ...action, raw, input: raw.slice(index).trim() };
        }
    }
    return null;
}