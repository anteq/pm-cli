function init() {
    module.exports.input = document.querySelector('.input-search');
    module.exports.content = document.querySelector('.content');
    module.exports.main = document.querySelector('.main');
}

function setDarkMode() {
    document.querySelector('.content').classList.add('dark');
}

function drawMain(mainNodes) {
    module.exports.main.innerHTML = '';
    module.exports.main.appendChild(mainNodes);
}

module.exports = { init, setDarkMode, drawMain };