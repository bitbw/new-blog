---
title: 利用博客园的MetaWeblog协议+nodejs同步hexo中md文件
date: 2021-10-11 14:44:08
tags:
  - hexo
  - 博客园
  - Nodejs
categories: Hexo
hash: 6ff5667e9d95b064dbd8673bb1e6758a8785edacf48faba12339637d5b779902
cnblogs:
  postid: "15393411"
---

## 博客园的 MetaWeblog 协议的使用

资料地址：https://www.cnblogs.com/caipeiyu/p/5354341.html背景

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

### 2. 博客园文章相关接口：

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

### 2.3 接口协议

#### 2.3.1 获取用户博客信息

- 功能：获取用户博客信息
- 方法名: blogger.getUsersBlogs
- 参数：见下文代码

示例：

```javascript
<?xml version="1.0"?>
<methodCall>
  <methodName>blogger.getUsersBlogs</methodName>
  <params>
    <param>
        <value><string></string></value>
    </param>
    <param>
        <value><string>{userName}</string></value>
    </param>
    <param>
        <value><string>{password}</string></value>
    </param>
  </params>
</methodCall>
```

#### 2.3.2 获取最近的文章

- 功能：获取最近的文章
- 方法名: metaWeblog.getRecentPosts
- 参数：见下文代码

```javascript
<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.getRecentPosts</methodName>
  <params>
    <param>
        <value><string>000000</string></value>
    </param>
    <param>
        <value><string>{userName}</string></value>
    </param>
    <param>
        <value><string>{password}</string></value>
    </param>

    <param>
        <value><i4>1</i4></value>
    </param>
  </params>
</methodCall>
```

#### 2.3.3 获取文章内容

- 功能：获取文章内容
- 方法名: metaWeblog.getPost
- 参数：见下文代码

```javascript
<?xml version="1.0"?>
    <methodCall>
      <methodName>metaWeblog.getPost</methodName>
      <params>
        <param>
            <value><string>{postid}</string></value>
        </param>
        <param>
            <value><string>{userName}</string></value>
        </param>
        <param>
            <value><string>{password}</string></value>
        </param>
      </params>
</methodCall>
```

#### 2.3.4 添加文章

- 功能：添加文章
- 方法名: metaWeblog.newPost
- 参数：见下文代码

```javascript
<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.newPost</methodName>
  <params>
    <param>
        <value><string></string></value>
    </param>
    <param>
        <value><string>{userName}</string></value>
    </param>
    <param>
        <value><string>{password}</string></value>
    </param>
    <param>
         <value>
                <struct>
                    <member>
                        <name>description</name>
                        <value>
                            <string>博客测试内容</string>
                        </value>
                    </member>
                    <member>
                        <name>title</name>
                        <value>
                            <string>标题测试内容</string>
                        </value>
                    </member>
                    <member>
                        <name>categories</name>
                        <value>
                            <array>
                                <data>
                                    <value>
                                        <string>[Markdown]</string>
                                    </value>
                                </data>
                            </array>
                        </value>
                    </member>
                </struct>
            </value>
    </param>
    <param>
        <value><boolean>0</boolean></value>
    </param>
  </params>
</methodCall>
```

#### 2.3.5 编辑文章

- 功能：编辑文章
- 方法名: metaWeblog.editPost
- 参数：见下文代码

```javascript
<?xml version="1.0"?>
<methodCall>
  <methodName>metaWeblog.editPost</methodName>
  <params>
    <param>
        <value><string>{postid}</string></value>
    </param>
    <param>
        <value><string>{userName}</string></value>
    </param>
    <param>
        <value><string>{password}</string></value>
    </param>
    <param>
         <value>
                <struct>
                    <member>
                        <name>description</name>
                        <value>
                            <string>博客测试内容222</string>
                        </value>
                    </member>
                    <member>
                        <name>title</name>
                        <value>
                            <string>标题测试内容222</string>
                        </value>
                    </member>
                    <member>
                        <name>categories</name>
                        <value>
                            <array>
                                <data>
                                    <value>
                                        <string>[Markdown]</string>
                                    </value>
                                </data>
                            </array>
                        </value>
                    </member>
                </struct>
            </value>
    </param>
    <param>
        <value><boolean>0</boolean></value>
    </param>
  </params>
</methodCall>
```

#### 2.3.6 删除文章

- 功能：删除文章
- 方法名: blogger.deletePost
- 参数：见下文代码

```javascript
<?xml version="1.0"?>
<methodCall>
  <methodName>blogger.deletePost</methodName>
  <params>
    <param>
        <value><string></string></value>
    </param>
    <param>
        <value><string>{postid}</string></value>
    </param>
    <param>
        <value><string>{userName}</string></value>
    </param>
    <param>
        <value><string>{password}</string></value>
    </param>
    <param>
        <value><boolean>0</boolean></value>
    </param>
  </params>
</methodCall>
```

## 使用 nodejs 完成文件读写和接口调用

### index.js

```js
/*
 * @Description: 批量将hexo中的md文件上传博客园
 * @Autor: Bowen
 * @Date: 2021-10-09 16:56:43
 * @LastEditors: Bowen
 * @LastEditTime: 2021-10-11 15:05:03
 */

const fs = require("fs").promises;
const path = require("path");
const YAML = require("yaml");
const crypto = require("crypto");

const { pushPost, getPost } = require("./api");

const dirPath = "C:xxx/source/_posts";

// 发布所有的文章
async function hanleAllPushPost() {
  let files = await fs.readdir(dirPath);
  for (const fileName of files) {
    if (!/\.md/.test(fileName)) continue;
    console.log("[********************************]");
    console.log("[fileName]", fileName);
    const filePath = path.resolve(dirPath, fileName);
    // await new Promise((r) => setTimeout(r, 1000), true);
    await handlePushPost(filePath);
  }
}
// 将文章原始字符分解为obj数据
function genArticleDate(articleOrigin) {
  const datas = articleOrigin.split("---");
  const temp = datas[1].replace(/\t/g, "");
  const titleObj = YAML.parse(temp);
  // datas.length > 3 为边际情况特殊处理一下
  const contentData = datas.length > 3 ? datas.slice(2).join("---") : datas[2];
  return {
    titleObj,
    contentData,
  };
}
// 将obj数据合成文章
function genArticleStr({ titleObj, contentData }) {
  const titleStr = "\n" + YAML.stringify(titleObj);
  const datas = ["", titleStr, contentData];
  const str = datas.join("---");
  return str;
}
// 根据path修改或者新建文章
async function handlePushPost(filePath) {
  const fileName = path.basename(filePath);
  const articleOrigin = await fs.readFile(filePath, "utf-8");
  const { titleObj, contentData } = genArticleDate(articleOrigin);
  const hash = crypto.createHash("sha256");
  hash.update(contentData);
  // 当前hash
  let nowContentHash = hash.digest("hex");
  let { cnblogs, hash: contentHash } = titleObj;
  let res;
  if (contentHash && contentHash == nowContentHash) {
    console.log("[hash值未变退出当前循环]");
    return;
  }
  // yaml中添加 hash
  titleObj.hash = nowContentHash;
  // 编辑
  if (cnblogs && cnblogs.postid) {
    console.log("[-------------修改-------------]");
    res = await pushPost({
      type: "edit",
      content: contentData,
      title: titleObj.title,
      postid: cnblogs.postid,
    });
    if (res.methodResponse.fault) {
      console.log(
        "[修改失败]",
        res.methodResponse.fault.value.struct.member[1].value.string
      );
      throw Error(res.methodResponse.fault.value.struct.member[1].value.string);
    }
    console.log("[修改成功]", res.methodResponse.params.param.value.boolean);
  } else {
    console.log("[-------------新建-------------]");
    titleObj.cnblogs = {};
    res = await pushPost({
      type: "add",
      content: contentData,
      title: titleObj.title,
    });
    res;
    if (res.methodResponse.fault) {
      console.log(
        "[上传失败]",
        res.methodResponse.fault.value.struct.member[1].value.string
      );
      throw Error(res.methodResponse.fault.value.struct.member[1].value.string);
    }
    console.log("[上传成功]", res.methodResponse.params.param.value.string);
    // yaml中添加 postid
    titleObj.cnblogs.postid = res.methodResponse.params.param.value.string;
  }
  // 回写数据
  const str = genArticleStr({ titleObj, contentData });
  await fs.writeFile(filePath, str);
  console.log("[回写成功]", fileName);
}

// test
// handlePushPost("C:xxx/source/_posts/js中的微观任务和宏观任务.md");
hanleAllPushPost();
```

### api.js

```js
/*
 * @Description: 博客园 api 封装 ，common 中填写 用户名和密码
 * @Autor: Bowen
 * @Date: 2021-10-09 16:07:25
 * @LastEditors: Bowen
 * @LastEditTime: 2021-10-11 15:09:36
 */
// 解析 xml
const parser = require("xml2json");
const axios = require("axios");

const _axios = axios.create();

const common = `<param>
    <value><string>{userName}</string></value>
</param>
<param>
    <value><string>{password}</string></value>
</param>`;

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const json = parser.toJson(response.data);
    const data = JSON.parse(json);
    return data;
  },
  (error) => {
    // 对响应错误做点什么
    let msg =
      error.response && error.response.data.message
        ? error.response.data.message
        : error;
    console.error(
      error.response ? `${error.response.status} : ${msg}` : `网络不可用`
    );
    return Promise.reject(error);
  }
);
// 发布或修改文章
function pushPost({ type = "add", content, title, postid }) {
  return axios.post(
    "https://rpc.cnblogs.com/metaweblog/bitbw",
    `<?xml version="1.0"?>
    <methodCall>
    <methodName>metaWeblog.${
      type === "add" ? "newPost" : "editPost"
    }</methodName>
    <params>
    <param>
        <value><string>${type === "add" ? "623687" : postid}</string></value>
    </param>
    ${common}
        <param>
            <value>
                    <struct>
                        <member>
                            <name>description</name>
                            <value>
                                <string>${XMLEscape(content)}</string>
                            </value>
                        </member>
                        <member>
                            <name>title</name>
                            <value>
                                <string>${XMLEscape(title)}</string>
                            </value>
                        </member>
                        <member>
                            <name>categories</name>
                            <value>
                                <array>
                                    <data>
                                        <value>
                                            <string>[Markdown]</string>
                                        </value>
                                    </data>
                                </array>
                            </value>
                        </member>
                    </struct>
                </value>
        </param>
        <param>
            <value><boolean>1</boolean></value>
        </param>
    </params>
    </methodCall>`
  );
}
// 获取文章数据
function getPost({ postid }) {
  return axios.post(
    "https://rpc.cnblogs.com/metaweblog/bitbw",
    `<?xml version="1.0"?>
<methodCall>
 <methodName>metaWeblog.getPost</methodName>
  <params>
    <param>
        <value><string>${postid}</string></value>
    </param>
   ${common}
  </params>
</methodCall>`
  );
}

function XMLEscape(content) {
  let newContent = content;
  newContent = newContent.replace(/&/g, "&amp;");
  newContent = newContent.replace(/</g, "&lt;");
  newContent = newContent.replace(/>/g, "&gt;");
  newContent = newContent.replace(/"/g, "&quot;");
  newContent = newContent.replace(/'/g, "&apos;");
  return newContent;
}

module.exports = {
  pushPost,
  getPost,
};
```
