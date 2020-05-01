const { actions } = require('./actions');
const { custom, projects } = require('./config');

module.exports = { parse };

function getActionContexts(triggers) {
    let definition = triggers.join(" ");
    return [...new Set(Array.from(definition.matchAll(/\{(.*?)\}/gi)).map(x => x[1]))];
}

function configureSearch() {
    var regexps = [];
    for (let action of actions) {
        let contexts = getActionContexts(action.triggers);
        if (projects && contexts.includes('project')) {
            for (let project of projects) {
                pushTriggerRegexps(action, project, project.key.toLowerCase(), regexps);
            }   
        } else if (custom && contexts.includes('custom')) {
            for (let url of custom) {
                for (let trigger of url.triggers) {
                    pushTriggerRegexps(action, url, trigger, regexps);
                }
            }
        }
    }
    return regexps;
}

function pushTriggerRegexps(action, context, replacement, regexps) {
    for (let trigger of action.triggers) {
        var regexObject = {
            action,
            regexp: new RegExp('^' + trigger.replace(`{${action.context}}`, replacement) + '(.*)', 'i')
        };
        regexObject[action.context] = context;
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