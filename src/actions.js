const addIssue = require('./actions/addIssue');
const openBacklog = require('./actions/openBacklog');
const openIssue = require('./actions/openIssue');
const openProject = require('./actions/openProject');
const searchIssues = require('./actions/searchIssues');

module.exports = { 
    actions: [openIssue, addIssue, openBacklog, searchIssues, openProject]
};