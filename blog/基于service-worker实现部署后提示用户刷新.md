---
title: 基于service-worker实现部署后提示用户刷新
date: 2022-04-28T10:22:38.000Z
tags:
  - service-worker
categories: js
hash: f4aa4f523fe89d5dca09a4d0a537030ab3424815ff85ed28e20f54332de8da4a
cnblogs:
  postid: '16228128'
---

## Vue项目部署新版本后提示用户刷新浏览器

### vue-cli 创建带pwd的项目

```bash
vue create pwa-product

# 选择 pwd

```

### 修改 src/registerServiceWorker.js

[registerServiceWorker](https://github.com/yyx990803/register-service-worker#readme)

```js
/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production" && navigator.serviceWorker) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },

    registered(registration) {
      console.log("Service worker has been registered.");
      // 通过测试新的服务工作线程来定期检查应用更新
      setInterval(() => {
        registration.update();
      }, 1000); // 这里为了测试 每秒检查一次
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    // 有个更新 通知页面更新
    updated(registration) {
      console.log("New content is available; please refresh.");
        //  创建一个自定义事件
      const event = new CustomEvent("swupdatefound", { detail: registration });
        // 触发这个事件
      document.dispatchEvent(event);
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });

  let refreshing;
    // 监听需要更新事件  调用 window.location.reload()
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (refreshing) return;

    window.location.reload();

    refreshing = true;
  });
}

```

### 在页面中添加事件监听

在 main.js 或 store 中添加事件监听

```js
// 添加对应自定义事件的监听
document.addEventListener("swupdatefound", (e) => {
  // 提示用户刷新
  let res = confirm("新内容可用,请刷新");
  if (res) {
    // e.detail == registration
    // waiting.postMessage({ type: "SKIP_WAITING" }) 是固定写法 
    // 用于触发更新  navigator.serviceWorker.addEventListener("controllerchange"...)
    e.detail.waiting.postMessage({
      type: "SKIP_WAITING",
    });
  }
});

```

为什么 waiting.postMessage({ type: "SKIP_WAITING" }) 会触发更新

在打包下的 dist 目录下service-worker.js 看到一下代码

```js
// self 是 worker 子线程的标准
//  waiting.postMessage({ type: "SKIP_WAITING" }) 会触发下面事件监听
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    //   调用 触发 controllerchange
    self.skipWaiting();
  }
});
```
