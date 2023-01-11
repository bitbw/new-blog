---
title: treer生成文件结构目录
date: 2020-05-22T14:48:29.000Z
tags:
  - js
categories: js
cnblogs:
  postid: '15393004'
hash: f73bc6ec6676acc4fded658436f01205a390b0a0bd317a5f55281375d3088a7a
---

参考资料：https://blog.csdn.net/weixin_43998681/article/details/88708847

> tip : treer 生成的机构目录是按大小写倒序生成 ，看起来会怪怪的 可以使用 git bash tree 命令生成 好看正序的

## treer

### 安装

```bash
$ npm install treer -g
// 全局安装treer，如果只想安装在当前目录可以去掉-g
```

### 使用方法

```bash
$ treer --help 					//输出treer的使用帮助信息
选项:
-V, --version          			//输出版本号信息
-d, --directory [dir]  			//指定一个目录来生成目录树
-i, --ignore [ig]      			//忽略特定的目录名
-e, --export [epath]   			//导出目录到一个文件中
```

### 具体示例

输出到 tree.md

```js
treer -i "/node_modules|dist_electron|devtools|nouse|.git|.vscode/" -e "tree.md"
```

## 使用 git bash tree 命令

git 中默认不带 tree 命令 需要下载 `tree.exe` 并将其复制到 `/git/usr/bin` 目录下,这样 `git bash` 本身就支持 `tree` 命令了.

下载地址： https://github.com/zruibin/tree/blob/master/tree.exe

### 使用方法

输出到 tree.md

```bash
$ tree -I  "node_modules|devtools|dist_electron|public|nouse"  > tree.md
```
