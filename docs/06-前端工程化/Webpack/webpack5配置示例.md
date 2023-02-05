---
title: webpack5配置示例
date: 2022-04-29T09:36:49.000Z
tags:
  - Webpack
  - Webpack-cli
categories: Webpack
hash: bd3053c076181308a1a4962a857ca0fbfc374bc258f08d981b5963a896784285
cnblogs:
  postid: '16228100'
---

## 简易 webpack 开发环境配置

用于开发一些简易功能和页面

### 安装

```bash
npm i -D webpack webpack-cli webpack-dev-server@next
```

### package.json

```json
  "scripts": {
    "dev": "webpack-dev-server"
  },
```

### webpack.config.js

```js
const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    // 虚拟路径 引入时使用 /virtual/bundle.js
    publicPath: "/virtual/",
  },
  devServer: {
    // 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要。。
    static: {
      directory: path.join(__dirname, "public"),
    },
    // 压缩
    compress: false,
    port: 9000,
    hot: true,
  },
    // source-map 方便进行调试
  devtool: "eval-source-map",
};

```

### scr 和 public 文件夹

 新建 /src/index.js

 ```js
 // 需要进行开发的入口
console.log("hello webpack")
 ```

 新建 /public/index.html

 ```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack5 dev</title>
</head>
<body>
    <script src="/virtual/bundle.js"></script>
</body>
</html>
 ```

### 启动开发服务器

 ```
 npm run dev
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:9000/
<i> [webpack-dev-server] On Your Network (IPv4): http://192.168.1.71:9000/
<i> [webpack-dev-server] Content not from webpack is served from 'C:\BowenData\study\vue-theory\03_ast\public' directory
asset bundle.js 537 KiB [emitted] (name: main)
runtime modules 26.3 KiB 11 modules
modules by path ./node_modules/ 157 KiB
  modules by path ./node_modules/webpack-dev-server/client/ 52.4 KiB 12 modules
  modules by path ./node_modules/webpack/hot/*.js 4.3 KiB
    ./node_modules/webpack/hot/dev-server.js 1.59 KiB [built] [code generated] 
    ./node_modules/webpack/hot/log.js 1.34 KiB [built] [code generated]
    + 2 modules
  modules by path ./node_modules/html-entities/lib/*.js 81.3 KiB
    ./node_modules/html-entities/lib/index.js 7.74 KiB [built] [code generated]
    ./node_modules/html-entities/lib/named-references.js 72.7 KiB [built] [code generated]
    + 2 modules
  ./node_modules/ansi-html-community/index.js 4.16 KiB [built] [code generated]
  ./node_modules/events/events.js 14.5 KiB [built] [code generated]
./src/index.js 28 bytes [built] [code generated]
webpack 5.72.0 compiled successfully in 1574 ms
asset bundle.js 537 KiB [emitted] (name: main)
asset main.73bd99d3636e685c7e88.hot-update.js 1.47 KiB [emitted] [immutable] [hmr] (name: main)
asset main.73bd99d3636e685c7e88.hot-update.json 28 bytes [emitted] [immutable] [hmr]
Entrypoint main 538 KiB = bundle.js 537 KiB main.73bd99d3636e685c7e88.hot-update.js 1.47 KiB
cached modules 157 KiB [cached] 22 modules
runtime modules 26.3 KiB 11 modules
./src/index.js 64 bytes [built] [code generated]
webpack 5.72.0 compiled successfully in 136 ms
 ```
