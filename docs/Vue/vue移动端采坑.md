---
title: vue 移动端采坑
date: 2019-03-02T20:54:04.000Z
tags:
  - vue
categories: Vue
cnblogs:
  postid: '15393021'
hash: 53835ff44e9109a54d9bde51040c0fca509e832fcf39efc3d0fda1953ef323ca
---

## 1.报错

### 组件没注册报错

```js

vue.esm.js?efeb:591 [Vue warn]: Unknown custom element: <el-container> - did you register the component correctly? For recursive components, make sure to provide the "name" option.

found in

---> <Container> at src/components/Container.vue
       <App> at src/App.vue
         <Root>
```

**以上错误 表示你没有注册这个组件 需要单独注册**

### `JSON.parse()`的使用

![搜狗截图20191201171855](https://s2.loli.net/2023/01/13/2stKuc71689jizn.jpg)

> 注意：**`JSON.parse(null)` 是返回 null 其他除了 string 类型的数据都会报错**
