---
title: npm 下包问题
date: 2020-12-12 18:40:51
tags:
  - Nodejs
  - npm
  - js
categories: Nodejs
cnblogs:
  postid: "15392980"
hash: c655b2dcd4e79b434842304f9d87aa84944d9676805061f5c585f9fcdbe16bf9
---



### node 下包的过程

首先说下 node 下 需要预编译的包（例如[node-sass](https://npmmirror.com/mirrors/node-sass/)）的过程 ：

- node 下包首先会在线上找对应本地 node 版本和操作系统的包
- 有的无需系统支持就直接下
- 有的需要根据系统下对应的 tar.gz 包 用到 node-pre-gyp，如果找不到对应的 node 版本号和系统的包，node 会下载源码进行编译
- node 编译使用 node-gyp ,而 node-gyp 在不同的操作系统下需要不同的支持工具 ，win 是 python 和 Visual Studio ，在 linux 下需要 Python， make, 和 GCC ，在MacOS  需要 [Xcode](https://developer.apple.com/xcode/download/)，Python v3.6、v3.7、v3.8 或 v3.9，这里有详细的描述 https://github.com/nodejs/node-gyp

### node版本问题

node 不同版本影响到是否能直接下对应的包，所以装包前可以先看下[淘宝镜像](https://npmmirror.com/mirrors)上有没有对应 node 版本的包

> 以这个为例`node-v72-win32-x64.tar.gz `代表 node 的 NODE_MODULE_VERSION 版本号是 72 的 windows64 位的包，NODE_MODULE_VERSION 对应的 node 版本可以在https://nodejs.org/zh-cn/download/releases/ node 官网查询

ps: 使用 [nvm](https://www.jianshu.com/p/48185ef12fbf) 可以自如的切换 node 版本

### 设置国内镜像源

cnpm 安装：https://developer.aliyun.com/mirror/NPM?from=tnpm

设置 npm 下包地址 ： https://blog.csdn.net/weixin_40920953/article/details/86547291





