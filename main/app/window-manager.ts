import {
  app,
  BrowserWindow,
  screen,
  shell,
  BrowserWindowConstructorOptions,
  OpenDevToolsOptions,
} from 'electron';
import * as path from 'path';
import { Injectable } from 'injection-js';

class LocalStorage {
  constructor(private wm: WindowManager) {}

  /**
   * Set localStorage item.
   */
  public setItem(
    name: string | undefined,
    keyName: string,
    keyValue: string
  ): Promise<void> {
    const windows = name ? [this.wm.get(name)] : this.wm.getAll();

    return Promise.all(
      windows.map((w) =>
        w.webContents.executeJavaScript(
          `localStorage.setItem('${keyName}', '${keyValue}')`,
          true
        )
      )
    ).then(() => void 0);
  }

  /**
   * Get localStorage item.
   */
  public getItem(name: string, keyName: string): Promise<string> {
    const window = this.wm.get(name);
    return window.webContents.executeJavaScript(
      `localStorage.getItem('${keyName}')`,
      true
    );
  }
}

/**
 * The class that simplifies working with windows.
 * Expand it at your discretion.
 */
@Injectable()
export class WindowManager {
  private windows = new Map<string, BrowserWindow>();

  private defaultOptions: BrowserWindowConstructorOptions = {
    center: true,
    minHeight: 400,
    minWidth: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      allowRunningInsecureContent: !app.isPackaged,
      devTools: !app.isPackaged,
    },
  };

  public localStorage = new LocalStorage(this);

  /**
   * This method, as the name suggests, creates a new window,
   * it will create and return a new instance of the class BrowserWindow.
   */
  public open(
    name: string,
    url: string,
    options?: Partial<BrowserWindowConstructorOptions>
  ): BrowserWindow {
    if (this.windows.has(name))
      throw new Error(
        `The window with the specified name "${name}" is already open.`
      );

    const size = screen.getPrimaryDisplay().workAreaSize;

    options = {
      ...this.defaultOptions,
      title: name,
      width: size.width / 1.5,
      height: size.height / 1.25,
      ...(options || {}),
    };

    const window = new BrowserWindow(options);

    window.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    window.loadURL(url);

    this.windows.set(name, window);

    return window;
  }

  /**
   * An easy way to open the default window.
   */
  public openDefault(): BrowserWindow {
    let url = 'http://localhost:5000';

    if (app.isPackaged) {
      const pwd = path.join('file:', __dirname, './browser/index.html');
      url = new URL(pwd).href;
    }

    return this.open('default', url);
  }

  /**
   * Returns the window instance of the specified window.
   */
  public get(name: string): BrowserWindow {
    if (!this.windows.has(name))
      throw new Error(
        `The window with the specified name "${name}" wasn't found.`
      );

    return this.windows.get(name)!;
  }

  /**
   * Returns all the windows created by this module.
   */
  public getAll(): BrowserWindow[] {
    return Array.from(this.windows.values());
  }

  /**
   * Closes a window by its name.
   */
  public close(name: string): void {
    this.get(name).close();
    this.windows.delete(name);
  }

  /**
   * Closes all the windows created by this module.
   */
  public closeAll(): void {
    this.windows.forEach((w) => w.close());
    this.windows.clear();
  }

  /**
   * Maximizes a window. If name is specified it will target the named window.
   * If left out it will target the currently focused window. If the window is already maximized it will restore.
   */
  public maximize(name?: string): void {
    if (name) this.get(name).maximize();
    else this.windows.forEach((w) => w.maximize());
  }

  /**
   * Minimizes a window. If name is specified it will target the named window.
   * If left out it will target the currently focused window.
   */
  public minimize(name?: string): void {
    if (name) this.get(name).minimize();
    else this.windows.forEach((w) => w.minimize());
  }

  /**
   * Restores a minimized window by name.
   */
  public restore(name: string): void {
    this.get(name).restore();
  }

  /**
   * Opens the devtools.
   */
  public openDevTools(name: string, options?: OpenDevToolsOptions): void {
    this.get(name).webContents.openDevTools(options);
  }
}
