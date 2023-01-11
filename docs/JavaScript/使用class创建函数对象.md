---
title: 使用class创建函数对象
date: 2022-04-15T16:14:27.000Z
tags:
  - es6
categories: es6
hash: 7d17ae9fe5d618a0dbc9f1b4d87eda094e9a0ee0e1916f1b04ac4d5b02374823
cnblogs:
  postid: '16228118'
---

使用class创建函数对象 ,可以在 constructor 中返回一个函数 并设置其原型 === this

```js

class Logger {
  constructor(tags) {
    this.tags = [].concat(tags);
    let _this = this;
    function fn(tags) {
      _this.tags = _this.tags.concat(tags);
      return fn;
    }
    Object.setPrototypeOf(Object.getPrototypeOf(fn), this);
    return fn;
  }
  info(info) {
    console.log(this.tags.map(tag=>`[${tag}]`).join(""), info);
  }
}
/**
 * @description: 日志 支持链式调用例如 logger("tag1")("tag2")("tag3").info("info") 和 logger(["tag1","tag2"]).info("info")
 * @param {*} tag  [tag1][tag2]
 * @return {*} 返回 函数
 */
 let logger = new Logger()

```
