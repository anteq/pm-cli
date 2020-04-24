const addIssue = require('./addIssue');
const openCustom = require('./openCustom');
const openBacklog = require('./openBacklog');
const openIssue = require('./openIssue');
const openProject = require('./openProject');
const searchIssues = require('./searchIssues');

module.exports = { 
    actions: [openCustom, openIssue, addIssue, openBacklog, searchIssues, openProject]
};