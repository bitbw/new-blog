---
title: JS中常见获取随机数的方法
date: 2021-07-02 13:58:11
tags:
  - js
categories: js
cnblogs:
  postid: "15392492"
hash: b2438dd4644533a4c34c2df170d7ac638f73f79b6221efd416dc77912a7a554b
---

## JS 获取固定区间的随机数

```js
const start = 0;
const end = 20;
// parseInt
parseInt(Math.random() * (end - start + 1)) + start;
// floor
Math.floor(Math.random() * (end - start + 1)) + start;
// ceil
Math.ceil(Math.random() * (end - start + 1));
// 注意 round 首尾不是等比例 首尾比例是其他的 1/2
Math.round(Math.random() * (max - min)) + min;
```

## JS 简单生成由字母数字组合随机字符串示例

```js
/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位 , true 使用min - max  false 使用 min
 ** xuanfeng 2014-08-28
 */
function randomWord(randomFlag, min, max) {
  var str = "",
    range = min,
    arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}
```
