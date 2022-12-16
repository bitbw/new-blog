---
title: CSS常见问题汇总
date: 2020-06-08 16:59:20
tags:
    - CSS
categories: CSS
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
