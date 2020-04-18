const { remote, shell } = require('electron');
const { parseInput } = require('./parser');

function main() {
  var result;
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('spotlight_input').focus();
  });
  window.addEventListener('keyup', (e) => {
    result = parseInput(document.getElementById('spotlight_input').value);
    document.getElementById('spotlight_description').innerHTML = result ? result.text : '';
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && result.url) shell.openExternal(result.url, { activate: true });
    if (e.keyCode == '27') remote.getCurrentWindow().close();
  });
}

main();