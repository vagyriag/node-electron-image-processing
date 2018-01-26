const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const isDev = 'ELECTRON_IS_DEV' in process.env ? parseInt(process.env.ELECTRON_IS_DEV, 10) === 1 : 
              (process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath));

let win;

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600, frame: false });

  if(isDev){
    win.loadURL(url.format({
      pathname: 'localhost:8080',
      protocol: 'http',
    }));
    win.webContents.openDevTools();
  }
  else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);