import { contextBridge } from 'electron';

export const ElectronAPI = {};

contextBridge.exposeInMainWorld('electronAPI', ElectronAPI);
