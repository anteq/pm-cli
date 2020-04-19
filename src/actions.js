const addIssue = require('./actions/addIssue');
const openCustom = require('./actions/openCustom');
const openBacklog = require('./actions/openBacklog');
const openIssue = require('./actions/openIssue');
const openProject = require('./actions/openProject');
const searchIssues = require('./actions/searchIssues');

module.exports = { 
    actions: [openCustom, openIssue, addIssue, openBacklog, searchIssues, openProject]
};