---
title: picgo + typroa + smms|github|gitee 实现自动上传图床
date: 2021-02-06T16:18:02.000Z
authors:
  - bowen
tags:
  - picgo
  - typora
  - github
  - gitee
categories: 工具使用
cnblogs:
  postid: '15392984'
hash: 28f912eca09d2300025c93fb8637593c0456bb1189da8c52712936bb945848ab
---

## typora 结合 PicGo 设置 github 图床

详细教程：<https://blog.csdn.net/beichuchuanyue/article/details/105493948>

> 最近一直在用 ubuntu 所以令行） 实现直接使用 picgo-core （命上传图片

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

常见报错：<https://blog.csdn.net/qq754772661/article/details/111385955>

##

## PicGo 设置 gitee（码云）图床

[详细教程](https://blog.csdn.net/qq_39564555/article/details/105080209)

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

## typora 结合 PicGo 设置 smms 图床

- smms [注册账号](https://sm.ms/register)
- smms [Dashboard](https://sm.ms/home/) 找到 API Token  获取 token
- npm 全局安装 [picgo](https://picgo.github.io/PicGo-Core-Doc/zh/guide/getting-started.html#%E5%85%A8%E5%B1%80%E5%AE%89%E8%A3%85)
- 修改 picgo [配置文件](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90)
- 修改 typora 设置偏好 图像 上传服务设定  修改为 自定义命令 （custom command）  命令 ：`picgo upload`
