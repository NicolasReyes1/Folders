const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
const path = require('path');

document.addEventListener('DOMContentLoaded', function () {
  const selectFolderButton = document.getElementById('selectFolderButton');
  const createSubfoldersButton = document.getElementById('createSubfoldersButton');
  const basePathInput = document.getElementById('basePathInput');
  const txtFileInput = document.getElementById('txtFileInput');

  let basePath = '';

  selectFolderButton.addEventListener('click', async () => {
    try {
      const result = await ipcRenderer.invoke('select-folder');
      if (result) {
        basePath = result;
        basePathInput.value = basePath;
        console.log(`Carpeta base seleccionada: ${basePath}`);
      } else {
        console.log('Selección de carpeta cancelada por el usuario.');
      }
    } catch (error) {
      console.error('Error seleccionando carpeta:', error);
      alert('Error seleccionando carpeta. Verifique la consola para más detalles.');
    }
  });

  createSubfoldersButton.addEventListener('click', async () => {
    try {
      const txtFilePath = txtFileInput.files[0].path;
      const folderNames = await fs.readFile(txtFilePath, 'utf-8');
      const namesArray = folderNames.split('\n').map(name => name.trim()).filter(name => name !== '');

      if (namesArray.length === 0) {
        throw new Error('El archivo de texto está vacío o no contiene nombres válidos.');
      }

      const baseFolderPath = basePath;

      for (let name of namesArray) {
        const folderPath = path.join(baseFolderPath, name);
        await fs.ensureDir(folderPath);
        console.log(`Carpeta creada: ${folderPath}`);
      }

      alert('Subcarpetas creadas correctamente.');

    } catch (error) {
      console.error('Error creando subcarpetas:', error);
      alert('Error creando subcarpetas. Verifique la consola para más detalles.');
    }
  });
});
