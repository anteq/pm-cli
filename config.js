const path = require('path')

module.exports = {
    windowConfig: {
        width: 800,
        height: 800,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    }
};