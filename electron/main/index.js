import { app, BrowserWindow } from "electron";
import path from 'path';
import { projectRoot } from '../utils';
console.log(path);
let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(projectRoot, './electron/preload/index.js'),
    }
  });
  mainWindow.loadURL(process.argv[2]);
  mainWindow.webContents.openDevTools({ mode: 'undocked' });
});