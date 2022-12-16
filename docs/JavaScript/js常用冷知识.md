---
title: js常用冷知识
date: 2021-04-24 12:33:21
tags:
  - js
categories: js
cnblogs:
  postid: "15392538"
hash: 1e322b35e5ba96bdff5fd60a95cd42343c4f8ae16e28e2d713ef330922306c81
---

## 函数对象+空字串 = 函数内容

```js
function add(...arg) {
  return arg.reduce((per, cur) => per + cur, 0);
}

console.log(add + "");

//function add(...arg){
//   return  arg.reduce((per,cur)=>per + cur, 0)
//}
```

node.js 中 查看 CommonJS 的模块

index.js

```js
exports.a = 1;

console.log(arguments.callee + "");
```

使用 node 运行

```bash
node index.js
```

打印

```js
function (exports, require, module, __filename, __dirname) {

exports.a = 1

console.log(arguments.callee + "")
}
```

exports 为 module 中的属性
