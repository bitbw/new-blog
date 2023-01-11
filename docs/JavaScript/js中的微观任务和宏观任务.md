---
title: js中的微观任务和宏观任务
tags:
  - js
categories: js
date: 2020-09-14T10:35:43.000Z
cnblogs:
  postid: '15392523'
hash: 4185265c34801cd256b892a7ef6f1f673e4d7aa4a68d5813850ffa2bdd9e1e3b
---

# js 中的微观任务和宏观任务

> 首先 js 是单线程的,代码执行都在执行栈中，io 接口事件和 dom 事件都放在任务队列中，等到执行栈执行完毕再去任务队列中看有没有可执行的任务，这称之为事件循环

<!-- more -->

事件循环示意

![bg2014100802](https://bitbw.top/public/img/my_gallery/bg2014100802.png)

### 注意点 1

微观任务都是放在执行栈的最后来执行，还是在本轮事件循环中

宏观任务都是放在任务队列中执行，不在本轮事件循环之中

### 注意点 2

asycn 的 await 下面的代码相当于都在 promise 的 then 里面都是本轮事件循环的最末执行，也就是说 await 下面的代码在等待 await 期间会被放到栈尾，而执行 asnyc 函数下的代码

![微观任务和宏观任务](https://bitbw.top/public/img/my_gallery/微观任务和宏观任务.png)

总结：遇到 setimeout 就放一边 ，遇到 setImmediate 也放 一边，遇到 promise 或者 nextTick 就放到本轮最后，等到本轮执行结束去找可以执行的 settimeout 或**setImmediate**
