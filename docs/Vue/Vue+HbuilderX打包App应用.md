---
title: Vue-cli4+HbuilderX打包android+ios应用
date: 2021-03-25T10:19:42.000Z
tags:
  - Vue
  - HbuilderX
  - android
  - ios
categories: Vue
hash: d79f3ac66266ea6e68dac7b3fb9b1d1113c3787debc199e12f0244d661c34cde
cnblogs:
  postid: '15766336'
---

## 打包 vue web 项目

### 1.修改 build 的配置

在 vue-cli(4.x 版本)下，修改 vue.config.js, 如果没有就创建一个

```js
module.exports = {
  // 选项...
  publicPath: "./",
};
```

### 2.修改路由模式为 hash 模式

如果使用了路由并且路由模式为 history 模式的话，需要改为 hash 模式

```js
const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});
```

### 3.打包

运行 npm run build

打包后会生成 dist 目录， dist 目录之后会用到

## 使用 hbuildx 打包成 App

### 1.先在 dcloud 注册个开发者账号：

https://dev.dcloud.net.cn/

### 2.下载 hubilderx App 开发版本

（https://www.dcloud.io/hbuilderx.html），打开hbuilderx，点击左下角登录账号。

### 3.新建 h5+ App 项目：

文件->新建->项目

![image-20211022101917225](https://bitbw.top/public/img/my_gallery/20211022101926.png)

### 4.将 dist 目录和新建的项目合并

删除 myApp 项目里面的 css、img、js 文件夹；将打包后的 vue 静态资源文件夹 dist 里面的文件拷贝进 app 项目里：

![image-20211022102250128](https://bitbw.top/public/img/my_gallery/20211022102250.png)

### 5.修改 app 的配置文件 mainfest.json

![image-20211022102642627](https://bitbw.top/public/img/my_gallery/20211022102642.png)

#### 可选配置

图标配置
安装到手机上后显示的 app 图标。可以选择一个分辨率较大的图片，然后点击自动生成所有图标并配置。

启动图配置
取消勾选：启动界面显示等待雪花

SDK 配置
根据 app 项目需求，选择相应的第三方 SDK（一般需要去相应的 SDK 官网申请 key）

模块权限配置
app 需要用到的权限，会询问用户打开这些权限。勾选相应的权限模块即可。

### 6.云打包 Android app

选中需要打包的项目名，点击工具栏的“发行”，选择”原生 App-云打包“.

![image-20211022103310806](https://bitbw.top/public/img/my_gallery/20211022103310.png)

在弹出的框中，选择”使用 DCloud 公用证书“（也可以使用自有证书，需要查看官网说明），取消勾选 ”广告联盟“ 和 ”换量联盟“，点击最底部的”打包“按钮：

![image-20211022103342804](https://bitbw.top/public/img/my_gallery/20211022103342.png)

打包完成后打开文件位置 就可以看到生成的 apk 安卓安装文件了

![image-20211022105826098](https://bitbw.top/public/img/my_gallery/20211022105826.png)

#### 注意事项

因为是使用云打包需要排队，具体时间无法确定

### 7.调试

调试需要手机打开开发者模式通过 usb 连接电脑

运行-》运行到手机或模拟器 -》调试控制台

![image-20211022104005852](https://bitbw.top/public/img/my_gallery/20211022104006.png)
