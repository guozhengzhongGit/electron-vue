import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import resolve from 'vite-plugin-resolve'
import { viteDevPlugin } from './build/plugins/viteForElectronDevPlugin.js';

function transform2ESM() {
  // node 模块
  const needTransform2ESModules = [
    "os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"
  ];
  const result = {};
  for (const name of needTransform2ESModules) {
    result[name] = `const ${name} = require(${name}); export { ${name} as default }`;
  }
  // electron 内置模块
  const electronBuiltInModules = [ 'ipcRenderer', 'shell' ].join(',');
  result.electron = `
  const { ${electronBuiltInModules} } = require('electron');
  export {${electronBuiltInModules}};
  `
  return result;
}
;

// {
//   electron: `
//   const { ipcRenderer, shell } = require('electron');
//   export {
//     ipcRenderer,
//     shell,
//   }
// `,
// }
/** @type {import('vite').UserConfig} */
export default defineConfig({
  server: {
    host: '127.0.0.1'
  },
  plugins: [
  viteDevPlugin(), resolve(transform2ESM()), vue()
],
  build: {
    target: ['chrome112']
  }
})
