const { actions } = require('./actions');
const { custom, projects } = require('./config');

module.exports = { parse };

function configureSearch() {
    var regexps = [];
    for (let action of actions) {
        if (projects && action.context === 'project') {
            for (let project of projects) {
                pushTriggerRegexps(action, project, project.key.toLowerCase(), regexps);
            }   
        } else if (custom && action.context === 'custom') {
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

function parse(input) {
    let search = configureSearch();
    for (let action of search) {
        const match = input.match(action.regexp);
        if (match) {
            const index = match[1] === "" ? match[0].length : input.indexOf(match[1]);
            return { ...action, input: input.slice(index).trim() };
        }
    }
    return null;
}