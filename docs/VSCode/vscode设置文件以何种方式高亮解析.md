---
title: vscode设置文件以何种方式高亮解析
date: 2020-12-24 09:43:58
tags: 
 - vscode
categories: 工具使用
cnblogs:
  postid: "15393011"
hash: d1f6ae7a5d915a2e9c9562d296cd931f8ebf82b17d1f4a8d1968fe9e3eeb64bc
---

> 在实际工作中有时需要用到只定义文件后缀 ， 我最近遇到的项目需要定义.rule 文件 ，但语法类似 javascript，文件编辑起来很费劲，因为不带高亮和语法提示，每次修改文件后缀也麻烦 ，我需要的是.rule 文件，以 jjavascript 的方式让 vscode 解析提示和高亮；

## 修改设置

首选项 -> 设置 ->文本编辑器 ->文件

![image-20201224095242258](https://bitbw.top/public/img/my_gallery/image-20201224095242258.png)

修改保存即可 ，语言要写全名 像`javascript `不要写成`js`

也可以直接编辑 setting

## setting 修改

![image-20201224095505868](https://bitbw.top/public/img/my_gallery/image-20201224095505868.png)

json 中添加

```json
  "files.associations": {
    "*.rule": "javascript"
  },
```
