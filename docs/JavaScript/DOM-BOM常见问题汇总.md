---
title: DOM&BOM常见问题汇总
date: 2021-03-25 09:56:48
tags:
  - DOM&BOM
categories: js
cnblogs:
  postid: "15392413"
hash: cc2d78a3be2b212cedfdad2d64404971604e5aeb86e2d0ad0310de4296aedcc6
---

# getBoundingClientRect 获取不准确

## getBoundingClientRect

用于获取元素的定位: [官方文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)

通常包含这几个属性

```js
{
    bottom: 497,
    height: 177,
    left: 131.296875,
    right: 1181.6875,
    top: 320,
    width: 1050.390625,
    x: 131.296875,
    y: 320
}
```

### 获取不准确

### 原因：

> 但是在元素有 css 动画进行中获取元素的定位会导，获取的定位不准确现象，为此需要在动画结束后再获取元素的定位

### 其他注意事项：

该 API 返回的 `DOMRect` 对象在现代浏览器中可以被修改。而对于返回值为 `DOMRectReadOnly` 的旧版本，返回值并不能被修改。在 IE 和 Edge 浏览器中，无法向他们返回的 [`ClientRect`](<https://msdn.microsoft.com/en-us/library/hh826029(VS.85).aspx>) 对象添加缺失的属性，对象可以防止 `x` 和 `y` 的回填。

由于兼容性问题（见下文），尽量仅使用 `left`, `top`, `right`, 和 `bottom`.属性是最安全的。

返回的 `DOMRect`对象中的属性不是自己的属性。 当使用`in` 和 `for...in` 运算符时能成功查找到返回的属性，但使用其他 API（例如 Object.keys（））查找时将失败。 而且，ES2015 和更高版本的功能（如 Object.assign（）和对象 rest/spread）将无法复制返回的属性
