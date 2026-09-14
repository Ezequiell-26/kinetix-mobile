const { app, BrowserWindow, Menu, shell, Tray, nativeImage } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    backgroundColor: '#080808',
    icon: path.join(__dirname, '../public/icons/icon-512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
  });

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3001';
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => (mainWindow = null));

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Tray (Windows/Mac)
  const icon = nativeImage.createFromPath(path.join(__dirname, '../public/icons/icon-192.png'));
  tray = new Tray(icon.resize({ width: 16, height: 16 }));
  tray.setToolTip('KINETIXFITT');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Mostrar', click: () => mainWindow.show() },
    { label: 'Recargar', click: () => mainWindow.reload() },
    { type: 'separator' },
    { label: 'Salir', click: () => app.quit() },
  ]));
  tray.on('click', () => mainWindow.show());
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Auto-update placeholder (electron-updater)
// require('electron-updater').autoUpdater.checkForUpdatesAndNotify();
