---
title: Vue原理
date: 2019-12-14T21:18:01.000Z
tags:
  - vue
categories: Vue
hash: baab0e6b4af0a7a1982ed1420347e436ba9570dc4220c926fa7756186434af9b
cnblogs:
  postid: '15931427'
---

## Vue更新数据流程流程

1. Compiler 解析模板成虚拟dom ( render 函数 createElement 就是直接生成虚拟dom )

2. Observer 发现数据改变 通知 Watcher

3. Watcher 通知 Compiler 重新解析模板成虚拟dom

4. diff 虚拟 dom 对改变的部分进行渲染

> Tip: 当使用 vue-loader 或 vueify 的时候，*.vue 文件内部的模板会在构建时预编译成 JavaScript ( 编译成 render + createElement )

## 监视数据更新

### 数据劫持

new Vue(new VueComponent) 时，遍历 data 通过 Object.defineProperty()，添加set和get(目的:数据发生改变从新解析模板(或者rander方法)生成新的虚dom，对比虚拟 dom 更新页面)

### 数据代理

将劫持后的数据赋值给 vm._data 上，再利用 Object.defineProperty()，将 vm._data，代理到 vm 上，(相当于 vm.xx === vm._data.xx)

## 对象和数组的监视

## 对象

data中对象数据在new Vue(new VueComponent) 时，递归遍历属性，给属性或者属性内部属性都添加set，get，新添加的属性需要使用vue.set添加监视，或者重新赋值对象。

## 数组

data中数组，在new Vue(new VueComponent) 时一样递归添加set和get，但是set，是对数组进行方法包装只有调用push，shift，unshift，pop，reverse，sort，才能触发模板编译，但数组内部的对象，同data中的对象一样的修改方式，改变数组也可以使用 vue.set，或者从新赋值数组
