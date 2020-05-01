const jira = require('../../connectors/jira');
const { shell } = require('electron');
const { build: buildItem } = require('./list-item');
const { build: buildDetails } = require('./list-detailed');
const { loadTemplate, emptyNode, appendChild } = require('../../utils');
const { people } = require('../../config'); 

const config = {
    key: 'list',
    template: loadTemplate('src/layouts/list/list.html'),
    onKeyDown: onKeyDown,
    resolve: resolveList
};
module.exports = config;

function onKeyDown(state, e) {
    if (e.keyCode == '38' && state.content.selectedIndex > 0) {
        state.content.selectedIndex -= 1;
        state.content.details = null;
        state.drawLayout();
    }
    else if (e.keyCode == '40' && state.content.selectedIndex < state.content.items.length - 1) {
        state.content.selectedIndex += 1;
        state.content.details = null;
        state.drawLayout();
    } else if (e.key === 'Enter') {
        shell.openExternal(state.content.items[state.content.selectedIndex].url, { activate: true });
    }
}

function getDetails(state, issue) {
    state.content.details = {
        issue: { loading: true, data: null },
        github: { loading: true, data: null },
        links: { loading: true, data: null }
    }
    setTimeout(() => {

        jira.getIssue(state.match.project, issue.key).then((result) => {
            console.debug('🌐 got issue details');
            state.content.details.issue.loading = false;
            state.content.details.issue.data = result;
            state.drawLayout();
        });

        if (state.match.project.dev) {
            jira.getGithubInfo(state.match.project, issue.id).then(result => {
                console.debug('🌐 got gh info about issue');
                state.content.details.github.loading = false;
                state.content.details.github.data = result;
                state.drawLayout();
            });
        }
    
        if (issue.links) {
            jira.getIssues(state.match.project, issue.links.map(x => x.issue)).then(result => {
                console.debug('🌐 got issue links');
                state.content.details.links.loading = false;
                state.content.details.links.data = result;
                state.drawLayout();
            });
        } else {
            state.content.details.links.loading = false;
        }

    })
}

function getCurrentDevSprint(state) {
    state.devSprint.loading = true;
    jira.getCurrentSprint(state.match.project).then(result => {
        console.debug('🌐 got current dev sprint data');
        let statuses = [...new Set(result.map(t => t.status.category))];
        developers = people.map(p => {
            let allIssues = result.filter(r => r.assignee.id === p.jiraId);
            return {
                assignee: p,
                issues: statuses.map(s => {
                    return {
                        status: s,
                        issues: allIssues.filter(i => i.status.category === s)
                    };
                })
            };
        });
        state.devSprint.loading = false;
        state.devSprint.data = developers;
        state.drawLayout();
    });
}

function resolveList(state, _selectedIndex) {
    let doc = config.template.cloneNode(true);
    let selectedIndex = _selectedIndex || 0;
    
    if (state.content.items) {
        emptyNode(doc, '.column-layout__left');
        for (let i in state.content.items) {
            appendChild(doc, '.column-layout__left', buildItem(i, state));
        }
        if (!state.content.details) {
            state.content.selectedIndex = selectedIndex;
            getDetails(state, state.content.items[state.content.selectedIndex]);
        }
        if (state.content.details.issue) {
            emptyNode(doc, '.column-layout__right');
            appendChild(doc, '.column-layout__right', buildDetails(state.content.details.issue.data, state));
            if (state.content.details.links) {
                for (let i in state.content.details.links.data) {
                    // todo need to download gh data about links
                    appendChild(doc, '.column-layout__right', buildDetails(state.content.details.links.data[i], state));
                }
            }
        }
        if (!state.devSprint.loading && !state.devSprint.data) {
            getCurrentDevSprint(state);
        }
        
    }
    
    return doc;
}

