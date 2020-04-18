// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, Menu, Tray } = require('electron')
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    frame: false,
    webPreferences: {
        preload: path.join(__dirname, 'src/preload.js')
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.on('blur', () => {
    setTimeout(() => {mainWindow.close()}, 500);
  });
  // mainWindow.webContents.openDevTools()
}

app.on('ready', () => {
  app.dock.hide();
  createTray();
  registerShortcut();
})

function createTray() {
  tray = new Tray('jira-spotlightTemplate.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open (⌃+⌘+Space)', sublabel: '', type: 'normal', click: createWindow },
    { label: 'Settings', type: 'normal' },
    { type: 'separator' },
    { label: 'Quit', type: 'normal', click: () => app.quit() },
  ]);
  tray.setToolTip('This is my application.');
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
