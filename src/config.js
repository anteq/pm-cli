const { remote } = require('electron');

module.exports = remote.getGlobal('config').store;