const { remote, shell } = require('electron');
const { layouts } = require('./layouts');
const ui = require('./ui');
const parser = require('./parser');

let state = {
  raw: null, 
  content: {},
  devSprint: {loading: false, data: null},

  match: {},
  layoutConfig: {},

  drawLayout
};

function onInit(e) {
  ui.init();
  ui.input.focus();
  if (remote.getGlobal('darkMode')) ui.setDarkMode();
  parser.init();
  drawLayout();
}

async function onKeyUp(e) {
  if (state.raw !== ui.input.value) {
    state.raw = ui.input.value;
    state.match = parseInput();
    if (state.match) {
      if (state.content && state.content.cancel) state.content.cancel();
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
  if (e.keyCode == '27') remote.getCurrentWindow().close();
  if (state.layoutConfig && state.layoutConfig.onKeyDown) state.layoutConfig.onKeyDown(state, e);
}

function drawLayout() {
  console.debug('Drawing layout:', state);
  if (state.match.action && typeof state.match.action.layout !== 'undefined') {
    ui.content.classList.remove('hide-main');
    ui.content.classList.add('content--wide');
    state.layoutConfig = layouts.find(x => x.key === state.match.action.layout);
    ui.drawMain(state.layoutConfig.resolve(state, state.content.selectedIndex));
  } else {
    ui.content.classList.add('hide-main');
    ui.content.classList.remove('content--wide');
  }
}

function main() {
  window.addEventListener('DOMContentLoaded', onInit);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('keydown', onKeyDown);
};

main();