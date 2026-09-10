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


## flex布局设置flex=1的时候宽度被内部元素撑开的问题
在设置flex=1的元素上再设置个overflex：hidden即可
代表在该元素内部进行计算
Reference:https://blog.csdn.net/ddyy2695734664/article/details/112761966
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .parent {
        display: flex;
        width: 500px;
      }
      .father2 {
        flex: 0 0 100px;
      }

      .father {
        /* width: calc(100% - 100px); */ /*  或者使用 calc */
        flex: 1;
        overflow: hidden; /* 防止子元素宽度超出父元素 */
      }

      .son {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div class="parent">
      <div class="father2"></div>
      <div class="father">
        <div class="son">
          http://jxxxx/xxx/xx/issues/xxx-3277?filter=xxx/sdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsdfasdfasdfadfasdfasdfasdfasdfasdfasdfxxxxadfasdfasd
        </div>
      </div>
    </div>
  </body>
</html>

``
