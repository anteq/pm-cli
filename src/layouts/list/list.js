const jira = require('../../connectors/jira');
const github = require('../../connectors/github');
const { shell } = require('electron');
const { build: buildItem } = require('./list-item');
const { build: buildDetails } = require('./list-detailed');
const { loadTemplate, emptyNode, appendChild, setLoading } = require('../../utils');
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
        githubPulls: { loading: true, data: null },
        links: { loading: true, data: null }
    }
    setTimeout(() => {

        jira.getIssue(state.match.project, issue.key).then((result) => {
            console.debug('🌐 got issue details');
            state.content.details.issue.loading = false;
            state.content.details.issue.data = result;
            state.drawLayout();
        });

        if (state.match.project.github) {
            jira.getGithubInfo(state.match.project, issue.id).then(result => {
                console.debug('🌐 got gh info about issue', result);
                state.content.details.github.loading = false;
                if (!state.content.details.github.data) state.content.details.github.data = {};
                let openPRs = (result.prs || []).filter(x => x.status === 'OPEN');
                    for (let openPR of openPRs) {
                        getPR(state, openPR);
                    }
                state.content.details.github.data[issue.key] = result;
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
            for (let link of issue.links) {
                // todo: only for github true projects
                jira.getGithubInfo(state.match.project, link.issue.id).then(result => {
                    console.debug('🌐 got gh info about link', result);
                    if (!state.content.details.github.data) state.content.details.github.data = {};
                    state.content.details.github.data[link.issue.key] = result;
                    let openPRs = (result.prs || []).filter(x => x.status === 'OPEN');
                    for (let openPR of openPRs) {
                        getPR(openPR);
                    }
                    state.drawLayout();
                });
            }
        } else {
            state.content.details.links.loading = false;
        }

    })
}

function getPR(state, pr) {
    github.getPullById(pr.repo, pr.id).then(result => {
        if (!state.content.details.githubPulls.data) state.content.details.githubPulls.data = {};
        state.content.details.githubPulls.data[pr.id] = result;
        console.debug('🌐 got gh info about pr', result);
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
    let doc = config.template.load().cloneNode(true);
    let selectedIndex = _selectedIndex || 0;
    
    emptyNode(doc, '.list');
    if (state.content.items) {
        for (let i in state.content.items) {
            appendChild(doc, '.list', buildItem(i, state));
        }
        emptyNode(doc, '.details');
        if (!state.content.details) {
            state.content.selectedIndex = selectedIndex;
            setLoading(doc, '.details');
            getDetails(state, state.content.items[state.content.selectedIndex]);
        }
        if (state.content.details.issue && state.content.details.issue.data) {
            appendChild(doc, '.details', buildDetails(state.content.details.issue.data, state));
            if (state.content.details.links) {
                for (let i in state.content.details.links.data) {
                    appendChild(doc, '.details', buildDetails(state.content.details.links.data[i], state));
                }
            }
        }
        if (!state.devSprint.loading && !state.devSprint.data) {
            getCurrentDevSprint(state);
        }
    } else {
        setLoading(doc, '.list');
    }
    
    return doc;
}

