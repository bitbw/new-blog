---
title: axios常见问题汇总
date: 2020-04-12 17:08:55
tags:
  - axios
categories: 网络应用
hash: 454f8a7c89e672af80c3ac9b44569f9f2204ea9ef32a69eabdc235905451bb62
cnblogs:
  postid: "16227989"
---


### 关于 axios 上传文件超时的问题记录

### 问题

前端上传一个 7M 文件，上传一半连接中断，后端是 java， 报了一个 tomcat 的问题，让我一直以为是后端断开连接

但是postman却可以上传（postman没有设置连接超时）

本地调试发现无法进入后端断点 （进入超时状态）
但是后端本地可以进入（后端因为是本地地址没有进入超时状态）

我想了好久也没有想明白为什么（没有想到是前端超时断开连接 后端让我帮忙看问题 唉！！！ 我一直以为是后端兄弟的问题 让后端兄弟找了好久 结果却是前端的问题 唉！！！）

```js
// axios
const service = axios.create({
  // 公共接口
  baseURL: config[config["mode"]].basicURL,
  timeout: 5000, // 0 永不超时
});
// 设置了 5秒就超时
```

如果仔细看看 axios 返回的错误信息就可以直接是超时问题 `timeout of  5000ms exceeded`

### 解决

增大超时时间

```js
const service = axios.create({
  // 公共接口
  baseURL: config[config["mode"]].basicURL,
  timeout: 60000, // 0 永不超时
});
```

添加请求错误日志 打印详细错误信息

```js

// 3.响应拦截器
service.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    const { response } = error;
    let errMsg = response
      ? // 使用服务返回错误信息
        fmtError(response.data.code) || response.data.message || response.status
      : // 使用 axios 返回的错误信息
        `${error.message ? ":" + error.message : ""}`;
    logger("response error").error(errMsg);
    return Promise.reject(error);
  }
);

```

**每次出现问题后先看看前端报错信息 再进行分析**
**上传大文件时尽量不设置超时**
