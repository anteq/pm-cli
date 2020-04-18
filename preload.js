const { remote, shell } = require('electron');
const { parseInput } = require('./parser');

function main() {
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('spotlight-input').focus();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const url = parseInput(document.getElementById('spotlight-input').value)
      shell.openExternal(url, { activate: true });
    }
    if (e.keyCode == '27') {
      remote.getCurrentWindow().close();
    }
  });
}

main();