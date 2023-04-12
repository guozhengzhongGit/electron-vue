import { app, BrowserWindow } from "electron";
import path from 'path';
import { projectRoot } from '../utils';
import  CustomScheme from './registerScheme';
console.log(path);
let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
    }
  });
  if (process.argv[2]) {
    mainWindow.loadURL(process.argv[2]);
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
  } else {
    CustomScheme.registerScheme();
    mainWindow.loadURL('electron-vue3://index.html');
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
  }
});