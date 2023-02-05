---
title: NodeJS基础
date: 2021-05-03T09:24:18.000Z
tags:
  - Nodejs
categories: Nodejs
cnblogs:
  postid: '15392978'
hash: ba3c5efd5c8e2aaec0b64d0e113520c2a41f09710cf1ec16e6e2e69e0c78a1e6
---

## node 搜索包的过程

在 node 中使用 require 函数直接通过名称导入的包的搜索过程

- 首先在当前目录下寻找 node_modules 中有没有当前导入的包
- 如果没有就在往上级找 node_modules,找到就使用
- 如果找到根目录还没有找到需要导入的包，就会报错

## Buffer 缓存区

buffer 就是一个数组，数组中每个元素是占 1 字节（8bit）的二进制数据

> `<Buffer 68 65 6c 6c 6f 20 e4 b8 96 e7 95 8c>` 之所以显示是 16 进制的，是因为控制台要简短的显示，二进制太长了

```js
const { Buffer } = require("buffer");
//创建了一个占用10个字节的缓冲区(从内存中开辟一块10个字节的空间)  并全部重置为00
let buf = Buffer.alloc(10); // <Buffer 00 00 00 00 00 00 00 00 00 00>
// buf.length指占用的字节数
console.log(buf.length); // 10
let str = "hello 世界"; // 一个汉字占用3字节
buf = Buffer.from(str); // <Buffer 68 65 6c 6c 6f 20 e4 b8 96 e7 95 8c>
// hello 占用6字节，世界占用6字节
console.log(buf.length); // 12
// buf.toString 方法将buffer对象以utf-8编码格式转化为字符串
buf.toString(); // hello 世界
```

buffer 一般用于文件的读写时使用，将文件读到内存中（buffer），再将文件从内存（buffer）中写入到硬盘

## fs 文件系统

### 同步

### 异步

### 流式

流式相当于将一个管子，链接需要写入的文件，不断向需要写入的文件中流数据，直到管子关闭，或者数据流完，

流式读写常用于大文件的读写操作·

### 常用方法

#### rename

rename 方法 类似 linux 系统中的`mv` 移动文件命令，可以对文件进行重命名和移动操作

fs.rename(oldPath, newPath, callback)

fs.renameSync(oldPath, newPath)
