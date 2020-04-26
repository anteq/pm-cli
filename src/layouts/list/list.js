const jira = require('../../connectors/jira');
const { build: buildItem } = require('./list-item');
const { build: buildDetails } = require('./list-detailed');
const { loadTemplate, emptyNode, appendChild } = require('../../utils'); 

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
    }
}

function getDetails(state, issue) {
    state.content.details = {
        issue: { loading: true, data: null },
        github: { loading: true, data: null },
        links: { loading: true, data: null },
    }
    setTimeout(() => {
        // todo fix base url - get from config

        jira.getIssue({baseUrl: 'https://scalaric.atlassian.net'}, issue.key).then((result) => {
            state.content.details.issue.loading = false;
            state.content.details.issue.data = result;
            state.drawLayout();
        });

        jira.getGithubInfo({baseUrl: 'https://scalaric.atlassian.net'}, issue.id).then(result => {
            state.content.details.github.loading = false;
            state.content.details.github.data = result;
            state.drawLayout();
        });

        if (issue.links) {
            jira.getIssues({baseUrl: 'https://scalaric.atlassian.net'}, issue.links.map(x => x.issue)).then(result => {
                state.content.details.links.loading = false;
                state.content.details.links.data = result;
                state.drawLayout();
            });
        } else {
            state.content.details.links.loading = false;
        }

    })
}

function resolveList(state, _selectedIndex) {
    let doc = config.template.cloneNode(true);
    let selectedIndex = _selectedIndex || 0;
    
    if (state.content.items) {
        emptyNode(doc, '.column-layout__left');
        for (let i in state.content.items) {
            appendChild(doc, '.column-layout__left', buildItem(state.content.items[i], i == state.content.selectedIndex));
        }
        if (!state.content.details) {
            state.content.selectedIndex = selectedIndex;
            getDetails(state, state.content.items[state.content.selectedIndex]);
        }
        if (state.content.details.issue) {
            emptyNode(doc, '.column-layout__right');
            appendChild(doc, '.column-layout__right', buildDetails(state.content.details.issue.data));
            if (state.content.details.links) {
                for (let i in state.content.details.links.data) {
                    appendChild(doc, '.column-layout__right', buildDetails(state.content.details.links.data[i], state.content.details.issue.data));
                }
            }
        }
        
    }
    
    return doc;
}

