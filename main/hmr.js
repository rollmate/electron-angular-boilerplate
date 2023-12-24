const build = require('./esbuild.config');
const path = require('path');
const { api, StartOptions } = require('@electron-forge/core');

const main = async () => {
  const hmr = await build({
    watch: true,
    minify: false,
  });

  const ps = [];

  let timeoutID = null;

  hmr.on('onEnd', async (result) => {
    if (timeoutID) {
      clearTimeout(timeoutID);
      timeoutID = null;
    }

    timeoutID = setTimeout(async () => {
      if (result.errors.length) return;

      try {
        ps.forEach(pid => process.kill(pid));
        ps.length = 0;
      } catch (e) {}

      const p = await api
        .start({
          appPath: path.resolve(__dirname, '..'),
          inspect: process.argv.includes('--inspect-electron'),
        });

      ps.push(p.pid);
    }, 1000)
  });
};

if (require.main === module) {
  main().then();
} else {
  console.log('Module not supported');
}