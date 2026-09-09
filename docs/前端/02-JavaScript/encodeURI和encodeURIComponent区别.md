---
title: encodeURI和encodeURIComponent区别
date: 2021-07-23T13:38:06.000Z
tags:
  - js
categories: js
---

### 参考
[encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
[encodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)

## 区别

```js

const set1 = ";/?:@&=+$,#"; // Reserved Characters
const set2 = "-.!~*'()"; // Unreserved Marks
const set3 = "ABC abc 123"; // Alphanumeric Characters + Space

console.log(encodeURI(set1)); // ;/?:@&=+$,#
console.log(encodeURI(set2)); // -.!~*'()
console.log(encodeURI(set3)); // ABC%20abc%20123 (the space gets encoded as %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24%23
console.log(encodeURIComponent(set2)); // -.!~*'()
console.log(encodeURIComponent(set3)); // ABC%20abc%20123 (the space gets encoded as %20)


```

```
A–Z a–z 0–9 - _ . ! ~ * ' ( ) // encodeURI 和 encodeURIComponent 都不转义
; / ? : @ & = + $ , # // encodeURI 转义 ，encodeURIComponent 不转义
其他字符encodeURI 和 encodeURIComponent 都转义
```
