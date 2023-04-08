import path from 'path';
import fs from 'fs';
class BuildObject {
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
}