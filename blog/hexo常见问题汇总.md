---
title: hexo常见问题汇总
date: 2019-11-28 17:25:06
tags:
  - hexo
categories: Hexo
description: "hexo 上传 github 后图片不显示问题 , Next主题文章老是自动滚到底部评论区的问题"
cnblogs:
  postid: "15392424"
hash: e65bafa6052157d5fc5fad5ce20736d5df4985f172363cbb7652bf0cbb42cf77

---


[hexo官方文档](https://hexo.io/docs/)


## hexo 上传 github 后图片不显示问题

- 在文件夹下找到\_config.yml 文件 将`post_asset_folder:`修改为 true

- 将上面的参数修改后 直接`hexo new 文件名` 会自动创建出一个跟文件同名的文件夹 ，将图片等资料都放到文件夹中

- 下载依赖~`npm install hexo-asset-image https://github.com/CodeFalling/hexo-asset-image`

  > 注意下载 依赖一定要后面的网址 这接`hexo-asset-image` 会下载最新版 还会导致图片不显示
  >
  > 注意（）内部直接加文件名/图片名即可, 例如：`![1574935033235](hexo采坑日记/1574935033235.png)`
  >
  > 加相对路径例如`![1574935033235](./hexo采坑日记/1574935033235.png)` 也会导致图片不显示
  >
  > 注意：路径需要 encodeURI 才行 像这样`hexo%E9%87%87%E5%9D%91%E6%97%A5%E8%AE%B0/image-20200725174552781.png`

- 使用 typroa 修改图片路径 下面这种方法 typroa 会自动保存到命名文件夹下，并自动 encode

  ![image-20201215135603281](https://bitbw.top/public/img/my_gallery/image-20201215135603281.png)

## 注意事项

**编辑好 md 文档先在`hexo server` 运行一下在提交 github**

```js
Markdown 使用时（） { } 都需要转义 否者会报错
```

**每次提交 github 自动构建前，要重启一下 hexo server 然后看看没有报错 ，再进行提交**

## next 主题注意事项

canvas_ribbon 和 tree 需要配合在 CDN 中添加 git 默认不上传 lib 下的文件

## 关于报错

![image-20200725160508488](https://bitbw.top/public/img/my_gallery/image-20200725160508488.png)

没有任何提示 哪个文件，挨个改动回退试试，原来是因为`_config.yml`这里直接写中文是不行的，中文需要引号包裹

```yml
social:
  # 微博: http://weibo.com/your-user-name  这里不能使用中文  确使用方式如下  地址后是图标
  "微博": http://weibo.com/your-user-name || fab fa-weibo
  "知乎": http://www.zhihu.com/people/your-user-name || fab fa-zhihu
```

## Next 主题文章老是自动滚到底部评论区的问题

原因 :
设置了 utterances

```yml
utterances:
  enable: true
```

解决：
取消 utterances

```yml
utterances:
  enable: false
```

## hexo 4.2.1 升级至 6.2.0  Next 7.8.0 升级至 8.12.1

### hexo 升级

```sh
npm i -g npm-check # 检查之前安装的插件，都有哪些是可以升级的 

# cd hexo 目录
npm-check         # 检查那些依赖能够升级 并把 package.json 版本号升级到最新
npm update        # 安装升级

```

### Next 升级

[升级官方文档](https://theme-next.js.org/docs/getting-started/upgrade.html)

#### 安装

```sh
# cd hexo 目录
npm i hexo-theme-next

```

#### 修改配置文件位置

将`themes/next/_config.yml` 复制到 `hexo目录/_config.next.yml`

#### 备份原主题

将 `themes/next` 改为  `themes/next-old`

#### 运行

运行`hexo clean`并`hexo s`检查站点是否正常工作
