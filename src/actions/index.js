const addIssue = require('./addIssue');
const openCustom = require('./openCustom');
const openBacklog = require('./openBacklog');
const openIssue = require('./openIssue');
const openDev = require('./openDev');
const openProject = require('./openProject');
const searchIssues = require('./searchIssues');

module.exports = { 
    actions: [openCustom, openIssue, openDev, addIssue, openBacklog, searchIssues, openProject]
};