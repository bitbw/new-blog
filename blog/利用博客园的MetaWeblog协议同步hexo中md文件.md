---
title: 利用博客园的MetaWeblog协议+nodejs同步自建博客中的md文件
date: 2023-01-11T14:44:08.000Z
tags:
  - hexo
  - docusaurus
  - 博客园
  - Nodejs
categories: Blog
hash: 93a5c9d0f99c49c31486ea2bce06f24ea6f89b01c3c3da9721837983a2166500
cnblogs:
  postid: '15393411'
---
## 背景

因为一直在使用 hexo 自建博客，最近又切换到了 docusaurus ，但是又想同时发布到博客园，所以需要一个工具能将 md 文件直接发布到博客园，所以写了一个 [node 自动化上传脚本](https://github.com/bitbw/node-utils/blob/master/src/blog/postBlog.js) ，同时方便需要的人借鉴使用（2023年1月更新）
下面简单描述下  MetaWeblog 协议的使用  

## 博客园的 MetaWeblog 协议的使用

[原资料地址](https://cloud.tencent.com/developer/article/1608220?from=14588)

背景资料地址：<https://www.cnblogs.com/caipeiyu/p/5354341.html>

想实现自己的文章一处编写，多处发布到各大平台（比如博客园，CSDN）等要怎么实现呢。需要由这些组成：

1. 文章管理：一个管理文章知识的平台（网站），在这里撰写，编辑文章。比如：写博客的客户端软件，博客园等。
2. 第三方网站(平台）具有开放的 API 接口，比如博客园的 metaWebBlog。
3. 同步服务：读取文章，调开放的 API，将文章发布出去。

一般来说，写文章的软件很容易获得，如果目标平台再有开放接口，我们可以将文章通过接口进行发布。

**博客园支持 metaWebBlog 接口，使得可以接收来自 接口 的文章**

### 1. metaWebBlog 概述

> MetaWeblog API（MWA）是一个 Blog 程序接口标准。通过 MetaWeblog API，博客平台可以对外公布 blog 提供的服务，从而允许外面的程序新建，编辑，删除，发布 bolg。

MetaWeblog 使用 xml-RPC 作为通讯协议。

> XML-RPC 是一个远程过程调用（远端程序呼叫）（remote procedure call，RPC)的分布式计算协议，通过 XML 将调用函数封装，并使用 HTTP 协议作为传送机制。一个 XML-RPC 消息就是一个请求体为 xml 的 http-post 请求，被调用的方法在服务器端执行并将执行结果以 xml 格式编码后返回。

简单理解就是：在 HTTP 请求 中，发送 xml 格式描述的“调用指令”，如果调用成功，会收到 xml 格式描述的“执行结果”。

### 2. 博客园文章相关接口

- blogger.getUsersBlogs —— 获取用户博客信息
- metaWeblog.getRecentPosts —— 获取最近的文章
- metaWeblog.getPost —— 获取文章内容
- metaWeblog.newPost —— 添加文章
- metaWeblog.editPost —— 编辑文章
- blogger.deletePost —— 删除文章

还有一些关于 文章分类 的接口，可以在其接口文档中找到。

### 2.1 接口说明

在 博客园 设置页面的地步可以找到 API 接口的说明，类似这样：

```javascript
https://rpc.cnblogs.com/metaweblog/{userName}
```

上面的 {userName} 替换成实际的用户名。

下文仅说明“请求的接口和参数”，响应内容在发送成功后一看便知。

### 2.2 发送方式

- HTTP 请求
- POST 方式到： [https://rpc.cnblogs.com/metaweblog/](https://links.jianshu.com/go?to=https%3A%2F%2Frpc.cnblogs.com%2Fmetaweblog%2F){userName}
- 请求中的内容是 HTML 格式，描述了调用参数

## 使用 nodejs 完成文件读写和接口调用

资料

- [metaweblog api 封装 metaweblog-api](https://github.com/uhavemyword/metaweblog-api)
- [md 文件解析 gray-matter](https://www.npmjs.com/package/gray-matter#returned-object)

### index.js

```js

/*
 * @Description: 批量将hexo中的md文件上传博客园
 * @Autor: Bowen
 * @Date: 2021-10-09 16:56:43
 * @LastEditors: Bowen
 * @LastEditTime: 2023-01-11 10:09:47
 */

const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const matter = require("gray-matter");
const { newPost, editPost } = require("./api");

// 发布所有的文章
async function handleAllPushPost(dirPath) {
  let files = await fs.readdir(dirPath);
  for (const fileName of files) {
    const filePath = path.resolve(dirPath, fileName);
    // dir 继续递归
    let stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      await handleAllPushPost(filePath);
      continue;
    }
    console.log("[********************************]");
    console.log("[fileName]", fileName);
    // await new Promise((r) => setTimeout(r, 1000), true);
    await handlePushPost(filePath);
  }
}

// 根据path修改或者新建文章
async function handlePushPost(filePath) {
  const fileName = path.basename(filePath);
  // 解析 md 文件
  const grayMatterFile = matter.read(filePath);
  const { data, content } = grayMatterFile;
  if (!data || !data.title) return;
  // 获取当前哈希值 对比 之前的 哈希
  const hash = crypto.createHash("sha256");
  hash.update(content);
  let nowContentHash = hash.digest("hex");
  let { cnblogs, hash: contentHash } = data;
  if (contentHash && contentHash == nowContentHash) {
    console.log("[hash值未变退出当前循环]");
    return;
  }
  // yaml中添加 hash
  data.hash = nowContentHash;
  // 文章数据
  const categories = Array.isArray(data.tags) ? data.tags : [];
  // TODO: data.? 看自己的 md 文档是如何配置
  const post = {
    description: content,
    title: data.title,
    // 注意 要以 Markdown 格式发布 必须在 categories 中 添加  "[Markdown]"
    categories: ["[Markdown]"].concat(categories),
  };
  let res;
  // 编辑
  if (cnblogs && cnblogs.postid) {
    console.log("[-------------修改-------------]");
    try {
      res = await editPost(cnblogs.postid, post, true);
    } catch (error) {
      console.log("[修改失败]", error.message);
      throw Error(error.message);
    }
    console.log("[修改成功]", res);
  } else {
    console.log("[-------------新建-------------]");
    data.cnblogs = {};
    try {
      res = await newPost(post, true);
    } catch (error) {
      console.log("[上传失败]", error.message);
      throw Error(error.message);
    }
    console.log("[上传成功]", res);
    // yaml中添加 postid
    data.cnblogs.postid = res;
  }
  // 回写数据
  const str = grayMatterFile.stringify();
  await fs.writeFile(filePath, str);
  console.log("[回写成功]", fileName);
  // 等待 1分钟 后继续下一个
  await new Promise((r) => setTimeout(r, 3500, true));
}

(async () => {
  await handleAllPushPost("C:/bowen/product/new-blog/docs");
  // await handleAllPushPost("C:/bowen/product/new-blog/blog");
})();


```

### api.js

```js
const MetaWeblog = require("metaweblog-api");
const apiUrl = "https://rpc.cnblogs.com/metaweblog/username"; // use your blog API instead
const metaWeblog = new MetaWeblog(apiUrl);

const username ="username"
const password ="password || token"
const blogid ='blogid' // 通过 getUsersBlogs 查询
const appKey =''
const numberOfPosts =1

module.exports = {
  getUsersBlogs:()=> metaWeblog.getUsersBlogs(appKey, username, password),
  getRecentPosts:()=> metaWeblog.getRecentPosts(blogid, username, password, numberOfPosts),
  getCategories:()=> metaWeblog.getCategories(blogid, username, password),
  getPost:(postid)=> metaWeblog.getPost(postid, username, password),
  newPost: (post, publish)=> metaWeblog.newPost(blogid, username, password, post, publish),
  editPost: ( postid ,post, publish)=> metaWeblog.editPost(postid, username, password, post, publish),
  deletePost: ()=> metaWeblog.deletePost(appKey, postid, username, password, publish),
}
```
