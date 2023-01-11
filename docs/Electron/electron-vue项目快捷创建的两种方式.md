---
title: electron+vue项目快捷创建的两种方式
date: 2021-06-04T17:16:27.000Z
tags:
  - Vue
  - Electron
categories: Electron
cnblogs:
  postid: '15393040'
hash: b6e8597d136476ce496e17e7b05b45495e27a2a294d9c3b0bf84a8fe8051cc32
---

## 使用 vue-cli-plugin-electron-builder 生成项目(推荐)

vue-cli-plugin-electron-builder 官方文档：https://nklayman.github.io/vue-cli-plugin-electron-builder/

需要 vue-cli 最新版

使用 vue-cli 创建项目

```bash
vue create  项目名 #创建vue项目
```

添加使用 vue-cli-plugin-electron-builder 生成项目

```bash
vue add electron-builder # 自动生成带electron的项目
```

## 使用 electron-vue 模板创建（不推荐）

electron-vue 中文文档： https://simulatedgreg.gitbooks.io/electron-vue/content/cn/

```bash
# 安装 vue-cli 和 脚手架样板代码
npm install -g vue-cli
vue init simulatedgreg/electron-vue my-project

# 安装依赖并运行你的程序
cd my-project
yarn # 或者 npm install
yarn run dev # 或者 npm run dev
```

## 对比

个人觉得使用 vue-cli-plugin-electron-builder 生成项目更好用 而且文档详细，快速上手
