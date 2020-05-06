// Modules to control application life and create native browser window

require('v8-compile-cache');
const { app, nativeTheme, BrowserWindow, globalShortcut, Menu, Tray } = require('electron')
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const Store = require('electron-store');

const DEBUG = true;

function getAssetPath(assetPath) {
  return app.isPackaged ? path.join(process.resourcesPath, assetPath) : assetPath;
}

function setAssetPath() {
  global.assetPath = getAssetPath('');
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    transparent: true,
    webPreferences: {
        preload: path.join(__dirname, 'src/preload.js')
    }
  })
  mainWindow.loadFile('index.html')
  if (DEBUG) {
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.on('blur', () => {
      setTimeout(() => {mainWindow.close()}, 500);
    });
  }
}

app.on('ready', () => {
  app.dock.hide();
  createTray();
  registerShortcut();
  setDarkMode();
  createConfig();
  setAssetPath();
})

function createConfig() {
  let schema = JSON.parse(fs.readFileSync(getAssetPath('schema.json'), 'utf8'));
  try {
    global.config = new Store(
      {
        defaults: {},
        schema: schema.properties,
        fileExtension: 'yaml',
        serialize: yaml.safeDump,
        deserialize: yaml.safeLoad
    });
  } catch (e) {
    console.error(e);
  }

}

function openConfig() {
  global.config.openInEditor();
}

function createTray() {
  tray = new Tray(getAssetPath('assets/jira-spotlightTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open (⌃+⌘+Space)', sublabel: '', type: 'normal', click: createWindow },
    { label: 'Settings', type: 'normal', click: openConfig },
    { type: 'separator' },
    { label: 'Quit', type: 'normal', click: () => app.quit() },
  ]);
  tray.setToolTip('pm cli 0.3.0');
  tray.setContextMenu(contextMenu);
}

function registerShortcut() {
  const ret = globalShortcut.register('Control+Command+Space', () => {
    createWindow()
  });
  if (!ret) {
    console.log('registration failed')
  }
}

function setDarkMode() {
  if (nativeTheme.shouldUseDarkColors) {
    global.darkMode = true;
  }
}


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  globalShortcut.unregister('Control+Command+Space')
  globalShortcut.unregisterAll()
})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(createWindow)

// app.on('activate', function () {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) createWindow()
// })
