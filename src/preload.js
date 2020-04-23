const { remote, shell } = require('electron');
const { parseInput } = require('./parser');
const { api } = require('./config');
const request = require('request');

function main() {
  var result;
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.input-search').focus();
    if (remote.getGlobal('darkMode')) {
      document.querySelector('.content').classList.add('dark');
    }
  });
  window.addEventListener('keyup', (e) => {
    result = parseInput(document.querySelector('.input-search').value);
    if (result) {
      document.querySelector('.content').classList.remove('hide-main');
    } else {
      document.querySelector('.content').classList.add('hide-main');
    }
    document.querySelector('.big-content__description').innerHTML = result ? result.text : '';
    document.querySelector('.big-content__icon').innerHTML = result ? result.icon : '';
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && result && result.url) shell.openExternal(result.url, { activate: true });
    if (e.keyCode == '27') remote.getCurrentWindow().close();
  });

  const options = {
    url: 'https://scalaric.atlassian.net/rest/api/2/issue/TM-11132',
    json: true,
    headers: {
      'Authorization': 'Basic ' + Buffer.from(api.jira.login + ":" + api.jira.key).toString("base64")
    }
  };

  request.get(options, (err, res, data) => {
    console.debug(res)
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is already parsed as JSON:
      console.log(data);
    }
});

}

main();