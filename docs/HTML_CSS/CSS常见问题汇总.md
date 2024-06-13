---
title: CSS常见问题汇总
date: 2020-06-08T16:59:20.000Z
tags:
  - CSS
categories: CSS
hash: d687392243fe4d9ab4bd5052938bdfa2e2debd0888fcc2b4745a35c43dfc8616
cnblogs:
  postid: '17041085'
---

## flex 布局

## flex 布局下子元素 宽度或高度不生效

```html
<style>
  .father{
    display: flex;
    flex-direction: column;
  }
  .child1{
    /* 不生效 */
    height: 100px; 
  }
  .child3{
    flex: 1;
  }
</style>
<div class="father">
  <div class="child1"></div>
  <div class="child2"></div>
  <div class="child3"></div>
</div>
```

child1 设置高度无效

### 解决

```css
  .child1{
    /* 生效 */
    flex:0 0 100px;
  }
```

## position: sticky 不起作用
** 原因 **
父元素加了 `overflow-x: hidden` 属性
参考： https://zhuanlan.zhihu.com/p/107242529
