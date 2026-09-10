// Preload - safe bridge
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ezequiel', {
  platform: process.platform,
  isElectron: true,
  version: '1.0.0',
});
