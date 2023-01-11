---
title: React学习理解
date: 2020-12-24T14:35:01.000Z
tags:
  - react
categories: React
cnblogs:
  postid: '15392987'
hash: 631979fbd28fcec78b9dc069255621615688ef0a4766d3299b8178c4f568d843
---

## 表单

### 受控组件

官方定义

> 在 HTML 中，表单元素（如`<input>`、 `<textarea>` 和 `<select>`）通常自己维护 state，并根据用户输入进行更新。而在 React 中，可变> 状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 setState()来更新。
>
> 我们可以把两者结合起来，使 React 的 state 成为“唯一数据源”。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。

总结： 受控组件就相当与 Vue 中的 v-model

注意点：在受控组件上指定 value 的 prop 会阻止用户更改输入 ，value 设置为 undefined 或 null 了 用户可以自行输入

正确的方式是：

- 有 value 的绑定，就得有对应的 onChange 或者 onInupt 通过 setState 修改 value
- 如果让用户自行输入数据值，而无需对变化做处理 ，可以使用**非受控组件**

### react-router-dom

Route 放入 children 和 component 中的区别

```js

// children 中 home 通过 props 获取不到路由数据
<Route path="/home">
    <Home />
</Route>
// component 中 home 通过 props 可以获取到路由数据
<Route path="/home" component={Home}>
</Route>

```
