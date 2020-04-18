const { actions } = require('./actions');
const { projects } = require('./config');

module.exports = { parseInput };

function configureSearch() {
    var regexps = [];
    for (let project of projects) {
        for (let action of actions) {
            for (let trigger of action.triggers) {
                regexps.push({
                    project,
                    action,
                    regexp: new RegExp(trigger.replace('{project}', project.key.toLowerCase()) + '(.*)', 'i')
                });
            }
        }
    }
    return regexps;
}

function parseInput(input) {
    let search = configureSearch();
    for (let action of search) {
        const match = input.match(action.regexp);
        if (match) {
            const index = input.indexOf(match[1]);
            let result = action.action.resolve(action, input.slice(index).toLowerCase());
            return result;
        }
    }
}