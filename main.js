const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Habilitar la integración con Node.js en el proceso de renderizado
      contextIsolation: false, // Deshabilitar el aislamiento de contexto para facilitar el acceso a Node.js
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Manejar evento para seleccionar una carpeta
  ipcMain.handle('select-folder', async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      });

      if (!result.canceled) {
        return result.filePaths[0];
      } else {
        throw new Error('Selección de carpeta cancelada por el usuario.');
      }
    } catch (error) {
      console.error('Error seleccionando carpeta:', error);
      throw error;
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
