const esbuild = require('esbuild');
const path = require('path');
const EventEmitter = require('node:events');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

/**
 *
 * @param {EventEmitter} emitter
 * @returns {{name: string, setup(*): void}}
 */
const onEndEvenPlugin = (emitter) => {
  return {
    name: 'onEnd',
    setup(build) {
      build.onEnd((result) => {
        emitter.emit('onEnd', result);
      });
    },
  };
};

/**
 * Build main Electron process.
 * @param {{watch: boolean, minify: boolean}} options
 * @returns {Promise<EventEmitter>}
 */
const build = async (options) => {
  options = {
    minify: true,
    watch: false,
    ...(options || {}),
  };

  const emitter = new EventEmitter();

  const preloadCtx = await esbuild.context({
    entryPoints: [path.join(__dirname, 'preload.ts')],
    bundle: true,
    minify: options.minify,
    outdir: path.join(__dirname, '../dist'),
    logLevel: 'info',
    plugins: [
      nodeExternalsPlugin(),
      onEndEvenPlugin(emitter),
    ],
  });

  const otherCtx = await esbuild.context({
    entryPoints: {
      main: path.join(__dirname, 'main.ts'),
    },
    bundle: true,
    minify: options.minify,
    platform: 'node',
    outdir: path.join(__dirname, '../dist'),
    logLevel: 'info',
    plugins: [
      nodeExternalsPlugin(),
      onEndEvenPlugin(emitter),
    ],
  });

  if (options.watch) {
    await preloadCtx.watch();
    await otherCtx.watch();
  } else {
    await preloadCtx.rebuild();
    await otherCtx.rebuild();
    await preloadCtx.dispose();
    await otherCtx.dispose();
  }

  return emitter;
};

if (require.main === module) {
  build({
    watch: process.argv.includes('--watch') || process.argv.includes('-w'),
  }).catch((error) => console.error(error));
} else {
  module.exports = build;
}
