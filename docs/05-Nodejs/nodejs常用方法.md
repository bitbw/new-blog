---
title: Nodejs常用方法
date: 2022-03-07T17:09:09.000Z
tags:
  - Nodejs
categories: Nodejs
hash: b751824da64a9d6a1eadf12527373a013c5faa1f7b2ab3364e4b14cf2b777d3f
cnblogs:
  postid: '15992803'
---


## 路径是否存在，不存在则创建

```js
const path = require("path");
const fs = require("fs").promises;
/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
async function dirExists(dir) {
  //如果该路径且不是文件，返回true
  let isExists;
  try {
    isExists = await fs.stat(dir);
  } catch (error) {
    console.log("[log][dirExists] path is not exist");
    // 创建目录
  }
  if (isExists) {
    //如果该路径存在但是文件，返回false
    if (isExists.isFile()) {
      return false;
    }
    // 存在返回 true
    if (isExists.isDirectory()) {
      return true;
    }
  }

  //如果该路径不存在
  let pDir = path.parse(dir).dir; //拿到上级路径
  //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = await dirExists(pDir);
  let mkdirStatus;
  if (status) {
    try {
      mkdirStatus = await fs.mkdir(dir);
    } catch (error) {
      return false;
    }
  }
  console.log(`[log] ${dir} created`);
  return true;
}

```

## 删除文件夹和内部所有文件

```js
var fs = require("fs"); //引入fs模块
var path = require("path"); //引入path模块
/**
 * @description: 删除文件夹和内部所有文件
 * @param {*} dir
 * @return {*}
 */
function rmdirDeepSync(dir) {
  var files = fs.readdirSync(dir); //同步读取文件夹内容

  files.forEach(function (item, index) {
    //forEach循环
    let p = path.resolve(dir, item); //读取第二层的绝对路径
    let pathstat = fs.statSync(p); //独读取第二层文件状态
    if (!pathstat.isDirectory()) {
      //判断是否是文件夹
      fs.unlinkSync(p); //不是文件夹就删除
    } else {
      rmdirDeepSync(p); //是文件夹就递归
    }
  });
  fs.rmdirSync(dir); //删除已经为空的文件夹
}


```

## nodejs 使用 axios 发送 fromdata 文件

```js
const axios = require("axios");
const fs = require("fs").promises;
const fileSystem = require("fs");
const path = require("path");
const FormData = require("form-data"); // node 中没有 FormData 需要单独下载 form-data 包

const HTTP = axios.create({
  baseURL,
  maxBodyLength: Infinity, //设置适当的大小
});
// axios 上添加上传文件方法
HTTP.uploadFile = (url, formData) => {
  return HTTP({
    method: "post",
    url,
    data: formData,
    headers: {
      ...formData.getHeaders(),
    },
  });
};

// 添加请求拦截器
HTTP.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
HTTP.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 上传文件方法
async function uploadFile(url, filepath) {
  // 这里需要使用 createReadStream
  let file =  fileSystem.createReadStream(filepath);
  let formdata = new FormData();
  formdata.append("filekey", file);
  return HTTP.uploadFile(url, formdata)
}

```

## nodejs 创建交互式命令行工具

### 参考文档

[如何用node编写命令行工具，附上一个ginit示例，并推荐好用的命令行工具](https://blog.51cto.com/u_10585798/3269810)
[inquirer的简单使用](https://blog.51cto.com/u_15351653/3751979)
[inquirer npm](https://www.npmjs.com/package/inquirer#news)

### 项目依赖

以下是完整列表：

- chalk ：彩色输出
- clear ： 清空命令行屏幕
- clui ：绘制命令行中的表格、仪表盘、加载指示器等。
- figlet ：生成字符图案
- inquirer ：创建交互式的命令行界面
- minimist ：解析参数
- configstore：轻松加载和保存配置

还有这些：

- @octokit/rest：Node.js 里的 GitHub REST API 客户端
- lodash：JavaScript 工具库
- simple-git：在 Node.js 应用程序中运行 Git 命令的工具

### inquirer 的简单使用

command.js

```js
let inquirer = require("inquirer");

(async function () {
  let question = [
    { type: "editor", name: "dec", message: "描述", default: "" },
    { type: "input", name: "username", message: "姓名", default: "" },
    {
      type: "list",
      name: "study",
      message: "学历",
      choices: ["小学", "初中", "高中", "大学", "研究生"],
    },
    {
      type: "checkbox",
      name: "hobby",
      message: "爱好",
      choices: ["篮球", "足球", "游泳"],
    },
    { type: "confirm", name: "isMan", message: "man", default: true },
  ];

  let answer = await inquirer.prompt(question);
  console.log(answer);
  // 根据选项的结果继续交互
  if (answer.isMan) {
    answer = await inquirer.prompt([
      { type: "input", name: "test", message: "根据isMan结果", default: "" },
    ]);
  }
})();
```

```bash
node command.js
```
