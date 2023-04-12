export const viteDevPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server) {
      require("esbuild").buildSync({
        entryPoints: ["./electron/main/index.js", './electron/preload/index.js'],
        bundle: true,
        platform: "node",
        target: ['node18.14.0'],
        outdir: 'dist/electron',
        external: ["electron"],
      });
      server.httpServer.once("listening", () => {
        let { spawn } = require("child_process");
        let addressInfo = server.httpServer.address();
        let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
        let electronProcess = spawn(require("electron").toString(), ["./dist/electron/main/index.js", httpAddress], {
          cwd: process.cwd(),
          stdio: "inherit",
        });
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
        server.httpServer.once("close", () => {
          electronProcess.kill();
          process.exit();
        });
      });
    },
  };
};