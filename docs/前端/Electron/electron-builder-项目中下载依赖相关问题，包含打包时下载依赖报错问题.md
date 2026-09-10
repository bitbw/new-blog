---
title: electron-builder 项目中下载依赖相关问题，包含打包时下载依赖报错问题
date: 2021-06-07T11:15:46.000Z
tags:
  - electron-builder
  - Electron
categories: Electron
cnblogs:
  postid: '15392414'
hash: 31675e301524abba3c4569c10b12af52d06b18899daec069ca36f5b92fab457d
---

## 修改 electron 下载源

找到用户目录下对应源的配置文件，如果没有就新建一个即可

### npm

修改 `.npmrc`

```
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
```

### yarn

修改 `.yarnrc`

```
ELECTRON_MIRROR "http://npm.taobao.org/mirrors/electron/"
```

## 打包时下载依赖报错

下载不下来对应的包，比如我使用代理有时下载 github 上的对应包就会报错

### 解决

手动下载对应地址的包

下载放到`C:\Users\Administrator\AppData\Local\electron\Cache`下

### 说明

一般需要三个包 wincodesign，nsis，nsis-resources，

这个三个包分别创建`包名-版本号`的文件夹，然后将下载下了的压缩文件放`C:\Users\Administrator\AppData\Local\electron\Cache`下

也可以解压后放到`C:\Users\WX03\AppData\Local\electron-builder\Cache`下

这个是我的 electron-builer 的目录

```
├── Cache
│   ├── nsis
│   │   ├── nsis-3.0.3.2
│   │   ├── nsis-3.0.4.1
│   │   └── nsis-resources-3.4.1
│   └── winCodeSign
│       └── winCodeSign-2.6.0
├── nsis
│   ├── nsis-3.0.3.2
│   ├── nsis-3.0.4.1
└── winCodeSign
```

## 所有难下的包的对应淘宝镜像源解决方案

官方地址：https://npm.taobao.org/mirrors
