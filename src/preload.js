const { remote, shell } = require('electron');
const { parseInput } = require('./parser');

function main() {
  var result;
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('spotlight_input').focus();
    if (remote.getGlobal('darkMode')) {
      document.querySelector('body').classList.add('dark');
    }
  });
  window.addEventListener('keyup', (e) => {
    result = parseInput(document.getElementById('spotlight_input').value);
    if (result) {
      document.getElementById('spotlight_input').classList.add('match-found');
    } else {
      document.getElementById('spotlight_input').classList.remove('match-found');
    }
    document.getElementById('spotlight_description').innerHTML = result ? result.text : '';
    document.getElementById('spotlight_icon').innerHTML = result ? result.icon : '';
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && result && result.url) shell.openExternal(result.url, { activate: true });
    if (e.keyCode == '27') remote.getCurrentWindow().close();
  });
}

main();