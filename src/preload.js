const { remote, shell } = require('electron');
const { layouts } = require('./layouts');
const ui = require('./ui');
const parser = require('./parser');

let state = {
  raw: null, 
  url: null,
  content: {},

  action: {},
  layoutConfig: {},

  drawLayout
};

function onInit(e) {
  ui.init();
  ui.input.focus();
  if (remote.getGlobal('darkMode')) ui.setDarkMode();
}

async function onKeyUp(e) {
  if (state.raw !== ui.input.value) {
    state.raw = ui.input.value;
    // todo - separate parse input from getting initial info about action
    parseInput();
    if (state.action) {
      await resolveAction();
      drawLayout();
    }
  }
}

function parseInput() {
  let match = parser.parse(state.raw);
  state.action = match;
}

async function resolveAction() {
  let result = await state.action.action.resolve(state.action, state.action.input);
  // if (state.raw !== state.match.input) return; // todo: handle canceling responses better
  console.debug(result);
  state.url = result.url;
  state.action = result.action;
  state.content = result.content;
}

function onKeyDown(e) {
  if (e.key === 'Enter' && result && result.url) shell.openExternal(result.url, { activate: true });
  if (e.keyCode == '27') remote.getCurrentWindow().close();
  if (state.layoutConfig && state.layoutConfig.onKeyDown) state.layoutConfig.onKeyDown(state, e);
}

function drawLayout() {
  if (state.action && typeof state.action.layout !== 'undefined') {
    ui.content.classList.remove('hide-main');
    state.layoutConfig = layouts.find(x => x.key === state.action.layout)
    ui.drawMain(state.layoutConfig.resolve(state, state.content.selectedIndex));
  } else {
    ui.content.classList.add('hide-main');
  }
}

function main() {
  var result;
  window.addEventListener('DOMContentLoaded', onInit);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('keydown', onKeyDown);
};

main();