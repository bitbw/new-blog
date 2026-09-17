---
title: picgo插件开发
date: 2022-05-11T16:22:28.000Z
authors:
  - bowen
tags:
  - picgo
  - typora
categories: 工具与基础知识
hash: b9d59d061a56f52ed44c51b0f6ab65d185f1f71b4f1d05189876521085a44b00
cnblogs:
  postid: '17041160'
---
## 借鉴文档

[Typora配置picgo-core自动上传图片，及picgo-core上传组件开发](https://blog.csdn.net/weixin_45673647/article/details/121465975)

[PicGo插件开发文档](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/cli.html#%E7%AE%80%E4%BB%8B)

## 写在前面

为什么要自定义一个上传插件呢
因为 gitee 用不了了😔
觉得图片还是放到自己的服务器上安全
使用过`web-uploader`插件但是有问题调不通我的接口，于是自己写个上传插件方便一些
我的自定义上传插件 :[picgo-plugin-bitbw-upload 插件地址](https://www.npmjs.com/package/picgo-plugin-bitbw-upload)
<!-- more -->
## 插件开发

### 使用模板

 ```bash
 picgo init plugin <your-project-name>

 ```

### 进入编辑index.js

 ```js
 // https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/cli.html#transformer
module.exports = (ctx) => {
  const register = () => {
    // 上传
    ctx.helper.uploader.register("bitbw-uploader", {
      async handle(ctx) {
        console.log("=============ctx.output", ctx.output);
        // 获取当前插件的配置
        let config = ctx.getConfig("picgo-plugin-bitbw-upload");
        console.log("============= config", config);
        // 图片列表
        const imgList = ctx.output;
        try {
          for (const img of imgList) {
            if (img.fileName && img.buffer) {
              const base64Image = img.base64Image || Buffer.from(img.buffer);
              const options = {
                method: "POST",
                url:config.url,
                formData: {
                  [config.key]: {
                    value: base64Image,
                    options: {
                      filename: img.fileName,
                      contentType: "image/jpg",
                    },
                  },
                },
              };
              // request 使用 https://github.com/request/request
              let body = await ctx.Request.request(options);
              if (body) {
                delete img.base64Image;
                delete img.buffer;
                // 必须把 imgUrl 回填
                img.imgUrl = body;
              } else {
                throw new Error("Server error, please try again");
              }
            }
          }
          return ctx;
        } catch (err) {
          ctx.emit("notification", {
            title: "上传失败",
            body: "请检查你的配置以及网络",
            text: "text",
          });
          throw err;
        }
      },
    });
  };
  const commands = (ctx) => [
    {
      label: "",
      key: "",
      name: "",
      async handle(ctx, guiApi) {},
    },
  ];
  return {
    uploader: "bitbw-uploader",
    commands,
    register,
  };
};

 ```

### 加载插件

然后将你所写的插件的文件夹放到picgo[默认的配置文件所在的目录](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)里。注意插件文件夹名字必须以picgo-plugin-作为前缀，否则安装的时候picgo将不会读取。
然后在picgo默认配置文件所在的目录下，输入：

```sh
npm install ./picgo-plugin-<your-plugin-name>
```

### 编辑配置文件

修改 picgo[默认的配置文件所在的目录](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6) 下config.json

```json
{
  "picBed": {
    "uploader": "bitbw-uploader",
    "current": "bitbw-uploader"
  },
  "picgoPlugins": {
    "picgo-plugin-bitbw-upload": true
  },
  "picgo-plugin-bitbw-upload": {
    //  自定义 上传地址
    "url": "https://bitbw.top/xxxx/upload",
    // 自定义 formData 中的 key
    "key": "image"
  }
}
```

## Typora中配置Picgo-Core

![image-20220511163057062](https://s2.loli.net/2023/01/13/3V6YtN98ijakdlf.png)

## 发布插件

[官方文档](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/deploy.html#%E6%8F%92%E4%BB%B6%E5%8F%91%E5%B8%83)
[如何在npm上发布自己的包](https://blog.bitbw.top/Nodejs/npm%E5%AD%A6%E4%B9%A0/)
