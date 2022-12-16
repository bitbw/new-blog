---
title: ubuntu下常用软件的安装
date: 2021-01-10 08:15:42
tags:
  - Linux
  - ubuntu
  - git
categories: Linux
cnblogs:
  postid: "15393009"
hash: de9854ea840a2437bd4da32b1465d79b2e45e858294d56a8aa5db9380bb60d11
---

## 安装 git

官方：https://git-scm.com/download/linux

## 安装搜狗拼音

官方：https://pinyin.sogou.com/linux/ ，https://pinyin.sogou.com/linux/help.php

## qq

官方：https://im.qq.com/linuxqq/download.html

### 百度网盘

官方：https://pan.baidu.com/download

## 微信网页可用版本

https://dcstore.spark-app.store/store/chat/wechat-linux-spark/

## nginx

安装

```bash
sudo apt-get install nginx
```

查看 nginx 是否安装成功

```bash
nginx -v
```

启动 nginx

```bash
service nginx start
```

关闭

```bash
service nginx stop
```

详细教程：https://blog.csdn.net/qq_23832313/article/details/83578836

## 使用深度进行安装

> 官方地址：https://github.com/zq1997/deepin-wine

1. 执行命令

```bash
wget -O- https://deepin-wine.i-m.dev/setup.sh | sh
```

> 这一步将 apt 的存储库重定向到 Deeppin 储存库

成功将提示

```bash
大功告成，现在可以试试安装更新deepin-wine软件了，如：
微信：sudo apt-get install com.qq.weixin.deepin
QQ：sudo apt-get install com.qq.im.deepin
钉钉：sudo apt-get install com.dingtalk.deepin
由于新版变化，安装完成后需要注销重登录才能正常显示应用图标。
如果觉得有用，请到 https://github.com/zq1997/deepin-wine 点个star吧。
```

微信 文字乱码问题：https://github.com/zq1997/deepin-wine/issues/15

自己测试没问题的解决方案

```bash
sudo apt-get install ttf-wqy-microhei  #文泉驿-微米黑
sudo apt-get install ttf-wqy-zenhei  #文泉驿-正黑
sudo apt-get install xfonts-wqy #文泉驿-点阵宋体
```
