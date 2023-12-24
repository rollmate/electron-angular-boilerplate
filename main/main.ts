import 'reflect-metadata';
import { app, BrowserWindow, globalShortcut } from 'electron';
import { ReflectiveInjector } from 'injection-js';
import { App } from './app/app';
import { WindowManager } from './app/window-manager';

const injector = ReflectiveInjector.resolveAndCreate([App, WindowManager]);

// Angular like 'inject' function.
export const inject: <T>(token: unknown, notFoundValue?: unknown) => T =
  injector.get.bind(injector);

app
  .whenReady()
  .then(() => inject<App>(App).whenReady())
  .catch((error) => console.error(error));

app.on('window-all-closed', () => {
  // Quit the app when all windows are closed (Windows & Linux)
  // https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app#quit-the-app-when-all-windows-are-closed-windows--linux
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // Open a window if none are open (macOS)
  // https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app#open-a-window-if-none-are-open-macos
  if (BrowserWindow.getAllWindows().length === 0) inject<App>(App).whenReady();
});

app.on('browser-window-focus', () => {
  // Fix focus issues on Windows 10 using HMR.
  // https://github.com/electron/electron/issues/2867
  if (!app.isPackaged && BrowserWindow.getAllWindows().length === 1) {
    BrowserWindow.getAllWindows()[0].setAlwaysOnTop(true);
    BrowserWindow.getAllWindows()[0].setAlwaysOnTop(false);
  }

  // Disable ability reload the page.
  globalShortcut.register('CommandOrControl+R', () => {});
  globalShortcut.register('F5', () => {});
});

app.on('browser-window-blur', () => {
  // Enable ability reload the page.
  globalShortcut.unregister('CommandOrControl+R');
  globalShortcut.unregister('F5');
});
