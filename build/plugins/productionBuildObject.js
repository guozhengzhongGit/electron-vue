import path from 'path';
import fs from 'fs';
export default class BuildObject {
  //编译主进程代码
  buildMain() {
    require("esbuild").buildSync({
      entryPoints: ["./electron/main/index.js"],
      bundle: true,
      minify: true,
      platform: "node",
      outfile: "./dist/main.js",
      external: ["electron"],
    })
  }
  //为生产环境准备package.json
  preparePackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    localPkgJson.main = "main.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };
    let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
  }

  /**
* @type {import('electron-builder').Configuration}
* @see https://www.electron.build/configuration/configuration
*/
  buildInstaller() {
    const options = {
      config: {
        // "store” | “normal” | "maximum". - For testing builds, use 'store' to reduce build time significantly.
        compression: "normal",
        removePackageScripts: true,
        nodeGypRebuild: false,

        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "dist"),
        },
        files: [
          "**"
        ],
        extends: null,
        productName: "vue3-electron",
        appId: 'com.vue3-electron',
        asar: true,
        nsis: {
          oneClick: true,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "vue3Desktop",
          deleteAppDataOnUninstall: true,
        },

        mac: {
          target: 'dmg',
          hardenedRuntime: true,
          gatekeeperAssess: true,
          extendInfo: {
            NSAppleEventsUsageDescription: 'Let me use Apple Events.',
            NSCameraUsageDescription: 'Let me use the camera.',
            NSScreenCaptureDescription: 'Let me take screenshots.',
          }
        }
      },
      project: process.cwd(),
    };
    return require("electron-builder").build(options);
  }
}