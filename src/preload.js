const { remote, shell } = require('electron');
const { parseInput } = require('./parser');
const { layouts } = require('./layouts');

function main() {
  var result;
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.input-search').focus();
    if (remote.getGlobal('darkMode')) {
      document.querySelector('.content').classList.add('dark');
    }
  });
  window.addEventListener('keyup', (e) => {
    parseInput(document.querySelector('.input-search').value).then(r => {
      if (r) {
        let { result, input } = r;
        if (document.querySelector('.input-search').value !== input) return;
        if (result.action.layout) {
          document.querySelector('.content').classList.remove('hide-main');
          let layout = layouts.find(x => x.key === result.action.layout)
          document.querySelector('.main').innerHTML = '';
          document.querySelector('.main').appendChild(layout.resolve(result.content));
        } 
      } else {
        document.querySelector('.content').classList.add('hide-main');
      }
    });
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && result && result.url) shell.openExternal(result.url, { activate: true });
    if (e.keyCode == '27') remote.getCurrentWindow().close();
  });
};

main();