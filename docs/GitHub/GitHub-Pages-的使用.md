---
title: GitHub Pages 的使用
date: 2021-04-26 17:25:24
tags:
  - GitHub Pages
  - github
categories: Github
cnblogs:
  postid: "15392423"
hash: dd8cf64fb3c91d965cfe9d4cd17ea601c7ca6a57c62dce231ecb05717ca64f91
---

## 创建

https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 使用自定义域名

### 首先买一个自己域名

我是在阿里云买的域名：https://www.aliyun.com/?utm_content=se_1008364713

### 设置 DNS 解析

- 进入控制台->进入 DNS 云解析->域名解析->解析设置

![image-20210426174435458](https://bitbw.top/public/img/my_gallery/image-20210426174435458.png)

- 首次设置点击添加记录

![image-20210426174712072](https://bitbw.top/public/img/my_gallery/image-20210426174712072.png)

- 记录类型：选择 CNAME
- 主机记录：自己设置一个二级域名，我给我的博客用，所以以 blog 开头
- 记录值：githu 用户名.github.io.

### 项目中添加 CNAME 文件

使用 Github Action 自动构建项目时将 CNAME 添加到 public 文件夹下面

（我的项目 vue-cli 直接放到 public，如果使用 webpack 看看具体在哪个文件夹下）

将主机记录的地址填入即可

```
blog.zhangbowen.xyz
```

## 注意事项

### publicPath 的问题

publicPath 配置不对会导致 js 等文件出现 404 的问题

- 配置了自定义域名的情况 直接写`publicPath: "./",`
- 没配置自定义域名

```js
 // git page 需要指定公共路径为仓库名 否则会找不到index.html 中连接的资源
publicPath: process.env.NODE_ENV === "production" ? "/仓库名称/" : "./",
```
