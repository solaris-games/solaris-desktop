const { app, BrowserWindow, globalShortcut } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: 'logo.png'
  });

  win.maximizable && win.maximize();

  if (process.env.NODE_ENV !== 'DEV') {
    win.removeMenu();
  }

  const reloadWindow = () => win.reload();

  globalShortcut.register('f5', reloadWindow);
	globalShortcut.register('CommandOrControl+R', reloadWindow);

  let url = process.env.NODE_ENV === 'DEV' ? 'http://localhost:8080' : 'https://solaris.games';
  
  win.loadURL(url);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});