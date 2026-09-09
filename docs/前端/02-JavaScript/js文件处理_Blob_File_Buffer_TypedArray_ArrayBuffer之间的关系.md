---
title: js文件处理 Blob File Buffer TypedArray ArrayBuffer之间的关系
date: 2022-06-08T16:33:44.000Z
tags:
  - js
  - Nodejs
categories: js
hash: 10e0d78d31d318273d6687f9b66dc2821c656d3cac8665b4fecfba8937043fda
cnblogs:
  postid: '17041101'
---

## 官方文档

[Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)
[File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)
[Buffer](https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_buffers_and_typedarrays)
[Buffer.from](https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_static_method_buffer_from_arraybuffer_byteoffset_length)
[Buffer.from](https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_static_method_buffer_from_arraybuffer_byteoffset_length)
[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
[ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

## 关系

### 继承关系

Buffer 是 node 中的类型 Buffer 继承于 Uint8Array
Uint8Array 继承于 TypedArray （或者说是其中一种实现 TypedArray 不能直接new ）
TypedArray 有以下类型

- [Int8Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)
- [Uint8Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- [Uint8ClampedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)
- [Int16Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)
- [Uint16Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array)
- [Int32Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Int32Array)
- [Uint32Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)
- [Float32Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float32Array)
- [Float64Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float64Array)
- [DataView](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)
ArrayBufferView 就是  TypedArray
File 继承于 Blob

### 转换关系

ArrayBuffer 类型转换中的关键！ 可以转换为任何类型， 其他类型也可以转化为 ArrayBuffer

Buffer.from 接收 ArrayBuffer 转换为 Buffer
Buffer.buffer 可以获取到 ArrayBuffer

Uint8Array.buffer 可以获取到 ArrayBuffer
new Uint8Array 接收 ArrayBuffer 可以转化为 Uint8Array

new Blob 和 File 都可以接收 ArrayBuffer，ArrayBufferView，Blob 生成参数
Blob.arrayBuffer() 返回一个 promise 且包含 blob 所有内容的二进制格式的 ArrayBuffer

```js
// Uint8Array | ArrayBufferView | TypedArray
const buffer = new ArrayBuffer(8);
const uint8 = new Uint8Array(buffer)
uint8.buffer === buffer // true
```

```js
// node buffer
const buffer = new ArrayBuffer(8);
const buf = Buffer.from(buffer)
buf.buffer === buffer // true
```

```js
// Blob
const buffer = new ArrayBuffer(8);
let blob = new Blob([buffer])
blob.arrayBuffer().then((buf=>console.log(buf))) // buf !== buffer
```

```js
// File
const buffer = new ArrayBuffer(8);
let file = new File([buffer],"file.xxx")
file.arrayBuffer().then((buf=>console.log(buf))) // buf !== buffer
```
