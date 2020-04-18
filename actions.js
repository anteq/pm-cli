const add = require('./actions/add');
const backlog = require('./actions/backlog')
const open = require('./actions/open')
const search = require('./actions/search')

module.exports = { 
    actions: [open, add, backlog, search]
};