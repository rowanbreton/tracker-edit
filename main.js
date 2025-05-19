const { app, BrowserWindow } = require('electron');
const path                   = require('path');

// Try to pull in autoUpdater; if it’s not installed (e.g. in Fiddle), we’ll skip updates
let autoUpdater;
try {
  autoUpdater = require('electron-updater').autoUpdater;
} catch (err) {
  console.warn('electron-updater not found, auto-updates disabled');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', 'Trackericon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.once('ready-to-show', () => win.maximize());
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  if (autoUpdater) {
    // Kick off the update check
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available', () => {
      console.log('🔄 Update available');
    });

    autoUpdater.on('update-downloaded', () => {
      console.log('✅ Update downloaded; quitting & installing');
      autoUpdater.quitAndInstall();
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
