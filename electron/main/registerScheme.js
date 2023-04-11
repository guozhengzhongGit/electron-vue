import { protocol } from 'electron';
import fs from 'fs';
import path from 'path';

const config = {
  standard: true,
  supportFetchAPI: true,
  corsEnabled: true,
  stream: true,
  bypassCSP: true,
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'electron-vue3', privileges: config },
])


export default class CustomScheme {
  static getMimeType(extension) {
    let mimeType = "";
    if (extension === ".js") {
      mimeType = "text/javascript";
    } else if (extension === ".html") {
      mimeType = "text/html";
    } else if (extension === ".css") {
      mimeType = "text/css";
    } else if (extension === ".svg") {
      mimeType = "image/svg+xml";
    } else if (extension === ".json") {
      mimeType = "application/json";
    }
    return mimeType;
  }
  //注册自定义app协议
  static registerScheme() {
    protocol.registerStreamProtocol("electron-vue3", (request, callback) => {
      let pathName = new URL(request.url).pathname;
      let extension = path.extname(pathName).toLowerCase();
      if (extension == "") {
        pathName = "index.html";
        extension = ".html";
      }
      let tarFile = path.join(__dirname, pathName);
      callback({
        statusCode: 200,
        headers: { "content-type": this.getMimeType(extension) },
        data: fs.createReadStream(tarFile),
      });
    });
  }
}