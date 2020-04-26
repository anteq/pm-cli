const { remote, shell } = require('electron');
const { layouts } = require('./layouts');
const ui = require('./ui');
const parser = require('./parser');

let state = {
  raw: null, 
  content: {},

  match: {},
  layoutConfig: {},

  drawLayout
};

function onInit(e) {
  ui.init();
  ui.input.focus();
  if (remote.getGlobal('darkMode')) ui.setDarkMode();
  drawLayout();
}

async function onKeyUp(e) {
  if (state.raw !== ui.input.value) {
    state.raw = ui.input.value;
    state.match = parseInput();
    if (state.match) {
      state.content = await resolveAction();
      drawLayout();
    }
  }
}

function parseInput() {
  return parser.parse(state.raw);
}

async function resolveAction() {
  return state.match.action.resolve(state);
}

function onKeyDown(e) {
  if (e.key === 'Enter' && result && result.url) shell.openExternal(result.url, { activate: true });
  if (e.keyCode == '27') remote.getCurrentWindow().close();
  if (state.layoutConfig && state.layoutConfig.onKeyDown) state.layoutConfig.onKeyDown(state, e);
}

function drawLayout() {
  console.debug('state', state);
  if (state.match.action && typeof state.match.action.layout !== 'undefined') {
    ui.content.classList.remove('hide-main');
    state.layoutConfig = layouts.find(x => x.key === state.match.action.layout);
    ui.drawMain(state.layoutConfig.resolve(state, state.content.selectedIndex));
  } else {
    ui.content.classList.add('hide-main');
  }
}

function main() {
  window.addEventListener('DOMContentLoaded', onInit);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('keydown', onKeyDown);
};

main();