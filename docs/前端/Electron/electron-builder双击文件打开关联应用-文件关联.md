---
title: electron-builder双击文件打开关联应用(文件关联)
date: 2022-07-27T17:28:24.000Z
tags:
  - electron-builder
  - Electron
categories: Electron
hash: 7e9d86f1ab10b1d39943752c1b5f54f360e3c2356530d6db22339103b62df770
cnblogs:
  postid: '17041094'
---

[参考文章](https://blog.csdn.net/jingjingchen1014/article/details/121223905)

## 配置文件关联

[官方配置文档](https://www.electron.build/configuration/configuration#PlatformSpecificBuildOptions-fileAssociations)

```js
 fileAssociations: [
          {
            ext: "ipc", // 关联文件扩展名 .ipc
            name: "IPS Config File", // 名称 默认为 ext
            description: "iConfig Machine Config File", // -仅限 Windows 文件描述
            icon: ipcicon, // 图标的路径 例如： build/iConfig/ipc/ipc 就会去读取 build/iConfig/ipc/ipc.ico (.icns对于 MacOS 和.ico Windows)
            role: "Editor", // String -仅限 macOS应用程序在类型方面的角色。该值可以是Editor、Viewer、Shell或None。对应于CFBundleTypeRole
          },
        ],
```

## 添加进程通信

```js
// 主进程
win.on("ready-to-show", () => {
    // window 显示后
    logger.info("[ window ] ready-to-show");
    watchLauchFromIPC();
  });

/**
 * @description: 监视通过 ipc 文件启动
 * @param {*}
 * @return {*}
 */
function watchLauchFromIPC() {
  const argv = process.argv;
  // 不是 MacOS
  if (process.platform !== "darwin") {
    // argv[argv.length - 1] 为 ipc 文件路径
    const filePath = argv[argv.length - 1];
    if (/\.ipc$/.test(filePath)) {
      logger.info("[app] watchLauchFromIPC opne IPC File", filePath);
      bridge && bridge.win.webContents.send("launchFromIPC", filePath);
    }
  }
}
```

```js
// 渲染进程
ipcRenderer.on("launchFromIPC", (e, filePath) => {
  logger.info("[ipcRenderer] launchFromIPC filePath = ", filePath);
  // TODO: 这里拿到文件路径就开始处理吧 
});

```

### `MacOS`

`MacOS` 通过 `open-file` 获取到文件路径， 但 `open-file` 会在 `app` 的 `ready` 前触发,  所以直接模仿 win 的  `process.argv`， 将文件路径 push 到 `process.argv`

```js
// 主进程 
// macos ipc 文件启动
app.on("will-finish-launching", () => {
  // custom schema handler on macos
  app.on("open-file", (event, url) => {
    event.preventDefault();
    logger.info("[app] open-file url", url);
    process.argv.push(url);
  });
})
```

修改 `watchLauchFromIPC` 兼容 `MacOS`

```js
/**
 * @description: 监视通过 ipc 文件启动
 * @param {*}
 * @return {*}
 */
function watchLauchFromIPC() {
  const argv = process.argv;
  // argv[argv.length - 1] 为 ipc 文件路径
  const filePath = argv[argv.length - 1];
  if (/\.ipc$/.test(filePath)) {
    logger.info("[app] watchLauchFromIPC opne IPC File", filePath);
    bridge && bridge.win.webContents.send("launchFromIPC", filePath);
  }
}
```
