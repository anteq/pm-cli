const { remote, shell } = require('electron');
const { layouts } = require('./layouts');
const ui = require('./ui');
const parser = require('./parser');

let state = {
  value: null, 
  url: null,
  content: {},

  actionConfig: {},
  layoutConfig: {},

  drawLayout
};

function onInit(e) {
  ui.init();
  ui.input.focus();
  if (remote.getGlobal('darkMode')) ui.setDarkMode();
}

async function onKeyUp(e) {
  if (state.value !== ui.input.value) {
    state.value = ui.input.value;
    // todo - separate parse input from getting initial info about action
    await parseInput();
    drawLayout();
  }
}

async function parseInput() {
  let { result, input } = await parser.parse(state.value);
  if (state.value !== input) return; // todo: handle canceling responses better
  if (!result) result = {};
  state.url = result.url;
  state.actionConfig = result.action;
  state.content = result.content;
}

function onKeyDown(e) {
  if (e.key === 'Enter' && result && result.url) shell.openExternal(result.url, { activate: true });
  if (e.keyCode == '27') remote.getCurrentWindow().close();
  if (state.layoutConfig && state.layoutConfig.onKeyDown) state.layoutConfig.onKeyDown(state, e);
}

function drawLayout() {
  if (state.actionConfig && typeof state.actionConfig.layout !== 'undefined') {
    ui.content.classList.remove('hide-main');
    state.layoutConfig = layouts.find(x => x.key === state.actionConfig.layout)
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