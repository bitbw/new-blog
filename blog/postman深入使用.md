---
title: postman 深入使用
date: 2018-11-28T16:56:05.000Z
authors:
  - bowen
tags:
  - 工具使用
  - postman
categories: 工具使用
cnblogs:
  postid: '15392985'
hash: 1c497f0d69b51aa4ea34f958e0f37d28641bb491fd60856f751c2364c732979b
---

## 设置变量 用于地址拼接

![1574931493737](https://bitbw.top/public/img/my_gallery/1574931493737.png)

```js
// 使用时跟插值表达式一样用{{ }} 包裹 注意 /的拼接
```

![1574932590726](https://bitbw.top/public/img/my_gallery/1574932590726.png)

## 设置环境变量

### 小技巧

> 可将不同环境的 baseurl 统一设置成一个变量名，然后只需要切换环境就可以请求不同 baseurl 的接口，在配合接口调试阶段很好用

![image-20210425165810147](https://bitbw.top/public/img/my_gallery/image-20210425165810147.png)

## 拦截器：统一设置 token

![1574932641632](https://bitbw.top/public/img/my_gallery/1574932641632.png)

## 导出自己的项目

![1574932698478](https://bitbw.top/public/img/my_gallery/1574932698478.png)
