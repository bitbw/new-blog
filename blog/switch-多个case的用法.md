---
title: switch 多个case的用法
date: 2018-12-15T16:07:07.000Z
tags:
  - js
categories: js
cnblogs:
  postid: '15392992'
hash: 3602c4ea0f248d225c73f90e2699d224e00da3abd0b0962d46f8950eb2366e51
---

switch 中想要多个判断都进到一个分支中可以这样写

```js
for (const item of [1, 2, 3, 4, 5, 6]) {
  switch (item) {
    case 1:
    case 2:
    case 3:
    case 4: //以上case都执行这个分支
      console.log("进到1,2,3,4里", item);
      break;
    case 5:
    case 6:
      console.log("进到5,6里", item);
      break;
    default:
      break;
  }
}
//进到1,2,3,4里 1
//进到1,2,3,4里 2
//进到1,2,3,4里 3
//进到1,2,3,4里 4
//进到5,6里 5
//进到5,6里 6
```
