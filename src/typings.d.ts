import { ElectronAPI } from '../main/preload';

declare global {
  interface Window {
    electronAPI: typeof ElectronAPI;
  }
}
