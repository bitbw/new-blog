---
title: picgo + typroa + github (gitee) 实现自动上传图床
date: 2021-02-06 16:18:02
tags:
  - picgo
  - typora
  - github
  - gitee
categories: 工具使用
cnblogs:
  postid: "15392984"
hash: 4255ce77c8413554980c456e8f6ec9c73fd665e55b2a49b3f663b07574b17241
---

## typora 结合 PicGo 设置 github 图床

详细教程：https://blog.csdn.net/beichuchuanyue/article/details/105493948

> 最近一直在用 ubuntu 所以直接使用 picgo-core （命令行） 实现上传图片

## picgo-core 配置文件

> 如果配置好了 picgo app 直接把 iconfig 粘进来就行

```json
{
  "picBed": {
    "current": "github",
    // 具体配置
    "github": {
      "branch": "分支",
      "customUrl": "https://raw.githubusercontent.com/用户名/仓库/分支",
      "path": "img/", //具体文件夹`路径/`
      "repo": "zhangbowen-github/my-gallery", //  `/用户名/仓库`
      "token": "sdfasdfasdfasdf" //Settings -> Developer settings -> Personal access tokens->创建 全选
    },
    "uploader": "github"
  },
  "settings": {
    "shortKey": {
      "picgo:upload": {
        "enable": true,
        "key": "CommandOrControl+Shift+P",
        "name": "upload",
        "label": "快捷上传"
      }
    },
    "server": {
      "enable": true,
      "host": "127.0.0.1",
      "port": 36677 //端口号不要改
    },
    "showUpdateTip": true,
    "pasteStyle": "markdown",
    "autoRename": true,
    "rename": false,
    "autoStart": true,
    "miniWindowOntop": false,
    "checkBetaUpdate": true
  },
  "picgoPlugins": {},
  "debug": true,
  "PICGO_ENV": "GUI",
  "needReload": false
}
```

> 注意上传同名图片会导致失败

常见报错：https://blog.csdn.net/qq754772661/article/details/111385955

##

## PicGo 设置 gitee（码云）图床

详细教程：https://blog.csdn.net/qq_39564555/article/details/105080209

```json
// 具体配置
 "gitee": {
      "branch": "master",
      "customPath": "default",
      "customUrl": "https://gitee.com/zhangbowen-1/my-gallery/raw/master",
      "path": "/img",// `/路径`
      "repo": "zhangbowen-1/my-gallery/img",// `/用户名/仓库/路径`
      "token": "asdfasdfdfasdfasdfsadfasd"  // 设置-》私人令牌-》生产新令牌
    }
```
