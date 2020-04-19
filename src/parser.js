const { actions } = require('./actions');
const { custom, projects } = require('./config');

module.exports = { parseInput };

function configureSearch() {
    var regexps = [];
    for (let action of actions) {
        if (action.context === 'project') {
            for (let project of projects) {
                pushTriggerRegexps(action, project, project.key.toLowerCase(), regexps);
            }   
        } else if (action.context === 'custom') {
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
            regexp: new RegExp(trigger.replace(`{${action.context}}`, replacement) + '(.*)', 'i')
        };
        regexObject[action.context] = context;
        regexps.push(regexObject);
    }
}

function parseInput(input) {
    let search = configureSearch();
    for (let action of search) {
        const match = input.match(action.regexp);
        if (match) {
            // console.debug(match);
            const index = match[1] === "" ? match[0].length : input.indexOf(match[1]);
            let result = action.action.resolve(action, input.slice(index).toLowerCase().trim());
            return result;
        }
    }
}