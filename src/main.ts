import {app, BrowserWindow, ipcMain, nativeImage } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {CONVERSATION_MESSAGE_RECEIVED} from "./integration/events";
import {MessageData} from "./integration/messages";
import {createNotificationHandler} from "./main/notification";
import logoIcon from './assets/logo.png?inline';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

const solarisIcon = nativeImage.createFromDataURL(logoIcon);

const createWindow = async () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: solarisIcon,
        backgroundColor: '#000000',
        resizable: true,
        maximizable: true,
        minimizable: true,
    });

    mainWindow.removeMenu();

    mainWindow.webContents.on('before-input-event', (event, input) => {
        if ((input.control && input.key.toLowerCase() === 'r') || input.key.toLowerCase() === 'f5') {
            mainWindow.reload();
            event.preventDefault();
        }

        if (input.key.toLowerCase() === 'f12') {
            mainWindow.webContents.toggleDevTools();
            event.preventDefault();
        }

        if (input.key.toLowerCase() === 'f11') {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
            event.preventDefault();
        }
    });

    mainWindow.maximize();

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    const url = app.isPackaged ? 'https://solaris.games' : 'http://localhost:8080';

    await mainWindow.loadURL(url);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const postNotification = createNotificationHandler(solarisIcon);

ipcMain.on(CONVERSATION_MESSAGE_RECEIVED, (event, dataRaw) => {
    const data = dataRaw as MessageData;

    postNotification(`New message in ${data.gameName}`, `${data.fromPlayerAlias} has sent you a message in the game ${data.gameName}`);
});
