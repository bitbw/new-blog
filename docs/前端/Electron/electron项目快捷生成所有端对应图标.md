---
title: electron项目快捷生成所有端对应图标
date: 2021-06-09T09:00:31.000Z
tags:
  - Electron
categories: Electron
cnblogs:
  postid: '15392417'
hash: 6bb1e4f7a66a20c2fe3926bdd1a0c9cd1475c206a10a624369e68e0ceb7ae14a
---

## 使用 electron-icon-builder 可以一次性生成所有端对应的图标

github：https://github.com/safu9/electron-icon-builder

### 安装

```bash
npm install -g  electron-icon-builder
```

### 命令

```bash
electron-icon-builder --input=./build/icon.png --output=./build/icon --flatten
```

--input 为输入文件夹

--output 为输入文件夹

还可以在项目中安装使用
