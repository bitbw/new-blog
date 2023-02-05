---
title: 关于vue组件样式的作用域问题
date: 2019-12-03T22:15:57.000Z
tags:
  - vue
categories: Vue
cnblogs:
  postid: '15393035'
hash: 8ebc45c04b623855275fc190e9842b044a1b90bb97c7195d01ed146154a8ab11
---

> 参考文档：
>
> - <https://vue-loader.vuejs.org/zh/guide/scoped-css.html>

## 关于组件的作用域样式

影响全局：

```html
<style>
  /* 全局样式 */
</style>
```

作用域样式，只对当前组件内部生效：

```html
<style scoped>
  .example {
    color: red;
  }
</style>

<template>
  <div class="example">hi</div>
</template>
```

所谓的作用域，其实就是在转换的时候为其添加了一个唯一的属性名原理：

```html
<style>
  .example[data-v-f3f3eg9] {
    color: red;
  }
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

你可以在一个组件中同时使用有 scoped 和非 scoped 样式：

```html
<style>
  /* 全局样式 */
</style>

<style scoped>
  /* 本地样式 */
</style>
```

## 子组件的根元素

使用 `scoped` 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。

注意：只能是根元素。

## 如何设置子组件根元素的样式

方式一：审查元素，观察该组件根节点的 class 类名

方式二：手动给组件添加 class，该类名会自动作用到组件的根元素

以上两种方式也只能作用到子组件的根节点 ，想要作用子组件内部的节点有两种方法

方法一：为当前样式单独包一个 style 标签，去掉 scoped 作用全局即可，但不是很推荐

方法二：使用 vue 提供的深度作用选择器， 强烈推荐！

## 深度作用选择器

如果你希望 `scoped` 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 `>>>` 操作符：

```html
<style scoped>
  .a >>> .b {
    /* ... */
  }
</style>
```

上述代码将会编译成：

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

有些像 Sass 之类的预处理器无法正确解析 `>>>`。这种情况下你可以使用 `/deep/` 或 `::v-deep` 操作符取而代之——两者都是 `>>>` 的别名，同样可以正常工作。

建议使用 `/deep/` 或者 `::v-deep`，因为 `>>>` 可能在预处理器中报错。

```css
<style scoped>
.a /deep/ .b { /* ... */ }
</style>
```

## 总结

如果想要在父组件中影响子组件样式：

- 要嘛不要有作用域，那就是全局，影响任何组件
- 有作用域
  - 默认只能影响根节点
    - 审查元素找到子组件根节点类名使用
    - 或者手动给子组件添加一个 class，它会自动添加到子组件根节点的 class 中
  - 如果需要影响的更深，则使用深度选择器：`>>>`、`/deep/`、`::v-deep`

## 关于如何自定义第三方组件的内容

```html
<!--
  一般在使用第三方组件的时候，它们默认给出的是最常用的功能
  如果需要自定义内容展示，那就看文档，看看人家是否支持自定义插槽
  -->
<van-cell title="单元格" value="内容" label="hello" />

<van-cell title="单元格" value="内容" label="hello">
  <button slot="title">hello</button>

  <!-- 当你没有给元素插槽起名字的时候，这个组件提供了默认插槽 -->
  <span>默认内容</span>
  <span slot="default">默认内容</span>

  <!-- 同名插槽可以插入多次 -->
  <span slot="title">world</span>
</van-cell>
```
