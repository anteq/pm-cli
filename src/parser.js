const { actions } = require('./actions');
const config = require('./config');
const { cartesian } = require('./utils');

module.exports = { parse };

function getActionContexts(triggers) {
    let definition = triggers.join(" ");
    return [...new Set(Array.from(definition.matchAll(/\{(.*?)\}/gi)).map(x => x[1]))];
}

function configureSearch() {
    var regexps = [];
    for (let action of actions) {
        let slugs = getActionContexts(action.triggers);
        let options = slugs.map(slug => {
            return config[config.slugs.find(s => s.slug === slug).values].map( configItem => {
                return {
                    slug,
                    value: configItem
                };
            });
        });
        let allOptions = cartesian(...options);
        for (let option of allOptions) {
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
            regexString = regexString.replace(`{${valueToBeReplaced.slug}}`, valueToBeReplaced.value.key);
        }
        regexObject['regexp'] = new RegExp('^' + regexString + '(.*)', 'i');
        regexps.push(regexObject);
    }
}

function parse(raw) {
    let search = configureSearch();
    for (let action of search) {
        const match = raw.match(action.regexp);
        if (match) {
            const index = match[1] === "" ? match[0].length : raw.indexOf(match[1]);
            return { ...action, raw, input: raw.slice(index).trim() };
        }
    }
    return null;
}