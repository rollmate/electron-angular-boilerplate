import { Inject, Injectable } from 'injection-js';
import { WindowManager } from './window-manager';

@Injectable()
export class App {
  constructor(@Inject(WindowManager) public windowManager: WindowManager) {}

  public async whenReady(): Promise<void> {
    this.windowManager.openDefault();
  }
}
