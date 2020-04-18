const { remote, shell } = require('electron');
const { parseInput } = require('./parser');

function main() {
  var result;
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('spotlight_input').focus();
  });
  window.addEventListener('keyup', (e) => {
    result = parseInput(document.getElementById('spotlight_input').value);
    if (result) {
      document.getElementById('spotlight_results').style.display = "block";
      document.getElementById('spotlight_results').innerHTML = result.text;
    } else {
      document.getElementById('spotlight_results').style.display = "none";
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && result.url) shell.openExternal(result.url, { activate: true });
    if (e.keyCode == '27') remote.getCurrentWindow().close();
  });
}

main();