const { shell } = require('electron');
const { loadTemplate } = require('../../utils');
const { findAndFill } = require('../filler');
const { resolutionCategories } = require('../../constants');

const template = loadTemplate('src/layouts/list/list-detailed.html');

function build(issue, state) {
    if (!issue) return null;
    let github = state.content.details.github ? state.content.details.github.data : {};
    let devSprint = state.content.devSprint ? (state.content.devSprint.data || []) : [];

    let doc = template.cloneNode(true);

    let rank = {};
    let assigneeSprint = devSprint.find(x => x.assignee.jiraId == issue.assignee.id);
    console.debug('assigneesprint', assigneeSprint);
    let inProgress = assigneeSprint.issues.find(i => i.status === resolutionCategories.IN_PROGRESS) || { issues: [] };
    let toDo = assigneeSprint.issues.find(i => i.status === resolutionCategories.TO_DO) || { issues: [] };
    let issueRankInProgress = inProgress.issues.findIndex(x => x.key === issue.key);
    let issueRankToDo = toDo.issues.findIndex(x => x.key === issue.key);
    if (issueRankInProgress && issueRankInProgress !== -1) {
        rank = {
            type: resolutionCategories.IN_PROGRESS,
            index: issueRankInProgress,
            issuesBefore: inProgress.issues.slice(0, issueRankInProgress)
        };
    } else {
        rank = {
            type: resolutionCategories.TO_DO,
            index: inProgress.issues.length + issueRankToDo,
            issuesBefore: [...inProgress.issues, ...toDo.issues.slice(0, issueRankToDo)]
        };
    }
    console.debug(assigneeSprint);

    findAndFill(doc, {
        issue,
        rank
    }); 

    doc.dataset.url = issue.url;
    doc.addEventListener('click', () => {
        shell.openExternal(issue.url, { activate: true });
    });
    // if (github && github.prs) {
    //     for (let pr of github.prs) {
    //         let temp = doc.querySelector('.pr').cloneNode(true);
    //         temp.classList.remove('hide');
    //         findAndFill(temp, {
    //             pr
    //         });
    //         // temp.querySelector('.pr__header--title').innerHTML = pr.id + ' ' + pr.name;
    //         // temp.querySelector('.pr__header--sub').innerHTML = pr.updated.fromNow();
    //         // temp.querySelector('.pr__header--status').innerHTML = pr.status;
    //         if (pr.url.includes('tm-webapp') && !('merged', 'closed').includes(pr.status.toLowerCase())) {
    //             temp.querySelector('.pr__links').classList.remove('hide');
    //             temp.querySelector('.pr__links--app').setAttribute('href', `https://${data.key}-app.tagger.dev`);
    //             temp.querySelector('.pr__links--creator').setAttribute('href', `https://${data.key}-creator.tagger.dev`);
    //             temp.querySelector('.pr__links--collaborator').setAttribute('href', `https://${data.key}-collaborator.tagger.dev`);
    //         }
    //         addEventListener('click', () => {
    //             shell.openExternal(pr.url, { activate: true });
    //         });
    //         doc.appendChild(temp);
    //     }
    // }

    console.debug(doc);

    return doc;
}

module.exports = { build };
