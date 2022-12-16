---
title: Promise对象和async函数
date: 2018-5-28 18:52:44
tags:
  - es6
  - js
categories: js
cnblogs:
  postid: "15392986"
hash: eff422bd995c9d6a64c5eaedc9d28f52112ed312d6b6ae2fdfc0ebc883f51e61
---

## 异步代码

### 现在常见的的异步代码

- 定时器
- ajax 请求

#### 注意事项

**1.在 JavaScript 中，记住一件事儿：所有的异步回调函数执行一定在普通代码执行之后**

**2.如果想要获取异步代码的执行结果：通过回调函数来接收**

### 基于回调函数的异步流程控制

封装一个原生 get 请求

```js
function get(url, cd) {
  const xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.send();
  xhr.onload = function () {
    cd(this.response);
  };
}
```

#### 原生 ajax 请求注意事项

事件最好放在发送请求前 不然像捕获发送失败这种函数会获不到

```js
const xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {
  resolve(this.response);
});
xhr.addEventListener("error", function (err) {
  reject(err);
});
xhr.open("get", url);
xhr.send();
```

#### 异步并行

- 一起执行 不分先后顺序

```js
get("http://jsonplaceholder.typicode.com/posts", function (res) {
  console.log(1);
});
get("http://jsonplaceholder.typicode.com/comments", function (res) {
  console.log(2);
});
get("http://jsonplaceholder.typicode.com/users", function (res) {
  console.log(3);
});
```

#### 异步串行

- 依次执行 上一层执行完毕在执行下面代码

```js
get("http://jsonplaceholder.typicode.com/posts", function (res) {
  console.log(1);
  get("http://jsonplaceholder.typicode.com/comments", function (res) {
    console.log(2);
    get("http://jsonplaceholder.typicode.com/users", function (res) {
      console.log(3);
    });
  });
});
```

### 回调地狱

异步串行如果嵌套过深会造成经典的`回调地狱` 这时需要用到 es6 新增的 Promise 对象来解决

![img](https://bitbw.top/public/img/my_gallery/timg.jpg)

### axios 的串行

```js
axios({
  method: "GET",
  url: "http://jsonplaceholder.typicode.com/posts",
})
  .then((res) => {
    console.log("2 posts 的响应结果");
    return axios({
      method: "GET",
      url: "http://jsonplaceholder.typicode.com/users",
    });
  })
  .then((res) => {
    console.log("3 users 的响应结果");
    return axios({
      method: "GET",
      url: "http://jsonplaceholder.typicode.com/comments",
    });
  })
  .then((res) => {
    console.log("4 comments 的响应结果");
  });
```

### 补充：setTimeout、setInterval 被遗忘的第三个参数

[MDN](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)介绍

定时器启动时候，第三个以后的参数是作为第一个`func()`的参数传进去。

```js
var sum = function (x, y, z) {
  console.log(x + y + z); // 打印6
};
setTimeout(sum, 1000, 1, 2, 3);
```

## Promise 对象

>

### Promise 的含义

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

`Promise`对象有以下两个特点。

（1）对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对`Promise`对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

注意，为了行文方便，本章后面的`resolved`统一只指`fulfilled`状态，不包含`rejected`状态。

有了`Promise`对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，`Promise`对象提供统一的接口，使得控制异步操作更加容易。

`Promise`也有一些缺点。首先，无法取消`Promise`，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部。第三，当处于`pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

如果某些事件不断地反复发生，一般来说，使用 [Stream](https://nodejs.org/api/stream.html) 模式（node.js）是比部署`Promise`更好的选择。

### 基本用法

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

`Promise`构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

`resolve`函数的作用是，将`Promise`对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；`reject`函数的作用是，将`Promise`对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

`Promise`实例生成以后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数。

`then`方法可以接受两个回调函数作为参数。第一个回调函数是`Promise`对象的状态变为`resolved`时调用，第二个回调函数是`Promise`对象的状态变为`rejected`时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受`Promise`对象传出的值作为参数。

下面是一个`Promise`对象的简单例子。

```js
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, "done");
  });
}

timeout(100).then((value) => {
  console.log(value);
});
```

上面代码中，`timeout`方法返回一个`Promise`实例，表示一段时间以后才会发生的结果。过了指定的时间（`ms`参数）以后，`Promise`实例的状态变为`resolved`，就会触发`then`方法绑定的回调函数。

### Promise-then 方法

- then 方法执行完以后会返回一个新的 Promise 对象
- 如果是普通数据，那么它会把该数据包装为那个返回的 Promise 的 resolve 结果
- 如果你返回的数据就是一个 Promise 对象，那它就不做任何处理了

### Promise.all

\* Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

\* 所有参数的状态都变成 fulfilled，res 的状态才会变成 fulfilled

### Promise.race

\* Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

\* 参数之中有一个实例率先改变状态，res 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数

### Promise.allSettled

\* Promise.allSettled()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。

\* 只有等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected，包装实例才会结束。

### Promise.any

​ \* Promise.any()方法。该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。

​ \* 只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态；

## async 函数

**Async 函数简化了 Promise 的调用，本质还是 Promise，有点类似 promise 的 then 方法**

**任何函数都可以被标记为 async 函数**

```js
 // 具名函数：async function main() {
    // 匿名函数：async function () {}
    // 箭头函数：async () => {}
    // 对象函数成员简写：

    // const user = {
    //   sayHello: async function () {}
    //   sayHello: async () => {}
注意对象里函数的简写  async写在方法名的前面 其他的放在函数前即可
 //   async sayHello () {}
    // }
```

### async 函数-返回值

- async 函数始终返回 Promise
- async 函数的返回值
  - 如果是普通数据，则直接把它包装到 promise 对象中，数据就是 resolve 的结果
  - 如果你返回的直接就是一个 promise 对象，则不作任何处理
  - 如果你什么都没有反回，则返回一个空的 promise 对象

### await

await 代表等待的意思，就是等待后面的 promise 执行完返回后 在执行后续代码 ，相当于将后面的代码改成同步执行

```js
async function ayrequest() {
  const res = await request("http://jsonplaceholder.typicode.com/users");
  console.log(1); //此代码会等待上面代码返回后再执行
  request("http://jsonplaceholder.typicode.com/users");
  console.log(2); // 此代码不会等待上面代码返回 ， 直接执行
}
```

### async 函数-异常处理

跟推荐使用 try catch 语法来获取异常

```js
async function ayrequest() {
  const res = await request("http://jsonplaceholder.typicode.com/users");
  return request("http://jsonplaceholder.typicode.com/posts");
  // 异常处理
  try {
    console.log(1);
    const res = await request("sdf://dsfsdfsdf.sdf.com/dsf");
    console.log(2);
    console.log(res);
  } catch (error) {
    console.log(3);
    console.log("发送失败", error);
  }
}
```

### 在 Vue 中使用 async 函数

```js
async created () {
    axios({
      method: 'GET',
      url: 'http://jsonplaceholder.typicode.com/posts'
    }).then(res => {
      console.log(res)
    })
 }
```

## 利用 Promise + aysnc 实现对原生 ajax 的封装

> 这里利用 module 的 顶端可以直接使用 await 的特性

```html
<script type="module">
  function get(url) {
    // 返回一个封装的 Promise
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (res) => {
        let reseult = JSON.parse(res.target.response || "{}");
        // 成功resolve返回结果 状态变为 fulfilled （已成功）
        resolve(reseult);
      });
      xhr.addEventListener("error", (err) => {
        // 失败reject返回错误 状态变为 rejected （已失败）
        reject(err);
      });
      xhr.open("get", url);
      xhr.send();
    });
  }
  // 使用 await 等待 Promise的 返回值
  let res = await get("http://localhost:8848/getSysDB");
</script>
```

## 使用 Promise 的注意事项

### 将多个 Promise 包装成一个 Promise 的方法 ，都是并行执行

- Promise.all
- Promise.race
- Promise.allSettled
- Promise.any

这几个方法都用于将 Promise 实例作为参数，包装成一个新的 Promise 实例返回

这几个方法在执行的 Promise 时候，都是并行执行

**注意：如果有先执行完某个 Promise 在执行某个 Promise 的时候不可以这几种方法，需要改串行执行（一个执行完再执行另一个）**
