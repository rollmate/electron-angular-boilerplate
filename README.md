[<img src="https://blog.ninja-squad.com/assets/images/angular_gradient.png" alt="Angular Logo" width="80"/>](https://angular.dev/)
[<img src="https://www.vectorlogo.zone/logos/electronjs/electronjs-icon.svg" alt="Electron Logo" width="80"/>](https://electronjs.org/)

Electron Angular Boilerplate uses Electron, Angular and esbuild.

Includes Typescript, ESLint, Prettier, SASS, Hot reload

With this sample, you can:

- Run your app in a local development environment with Hot reload
- Run your app in a production environment
- Linting and code formatting out of the box
- Package your app into an executable file for Linux, Windows & Mac

## Version compatibility

| Branch | [Angular](https://angular.io/guide/versions) | [Electron](https://www.electronjs.org/docs/latest/tutorial/electron-timelines) | NodeJS                |
|--------|----------------------------------------------|--------------------------------------------------------------------------------|-----------------------|
| main   | 17.0.x                                       | 28.0.x                                                                         | ^18.18.0 \|\| ^20.9.0 |

## Install

Clone the repo and install dependencies:

``` bash
git clone https://github.com/rollmate/electron-angular-boilerplate.git your-project-name
cd your-project-name
npm install
```

## Linting and code formatting

[Setup ESLint in WebStorm](https://blog.jetbrains.com/webstorm/2016/08/using-external-tools/#set_up_eslint_to_autofix_files)

## Starting Development

Builds and serves your application, rebuilding on file changes:

``` bash
npm start
```

## Debugging

Renderer processes can be debugged using Chromium DevTools.

The main process can be debugged via command:

``` bash
npm run debug
```

Once your app is active, open `chrome://inspect` in any Chromium-based browser
to attach a debugger to the main process of your app.

## Packaging for Production

To package apps for the local platform:

``` bash
npm run build
```

## Updates

There is no need to do any special steps to update Angular and Electron.
Use standard update flows for each framework.

## Project structure

| Folder | Description                                |
|--------|--------------------------------------------|
| main   | Electron main process folder (NodeJS)      |
| src    | Electron renderer process folder (Angular) |

## Basic Included Commands

| Command       | Description                                                                  |
|---------------|------------------------------------------------------------------------------|
| npm start     | Builds and serves your application, rebuilding on file changes               |
| npm run debug | Builds and serves your application in debug mode, rebuilding on file changes |
| npm run build | Package your application into a platform-specific executable bundle          |
| npm run lint  | Runs linting tools on application code                                       |
| npm run test  | Runs Angular unit tests in a project                                         |

## License

MIT © Rollmate