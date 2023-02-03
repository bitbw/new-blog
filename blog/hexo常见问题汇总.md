---
title: hexo常见问题汇总
date: 2019-11-28T17:25:06.000Z
authors:
  - bowen
tags:
  - hexo
categories: Hexo
description: 'hexo 上传 github 后图片不显示问题 , Next主题文章老是自动滚到底部评论区的问题'
cnblogs:
  postid: '15392424'
hash: 5033056fca0ba167b9abfc194d3a1fa784a038b8da4e90cc90047d73a0e0846c
---


[hexo官方文档](https://hexo.io/docs/)


## 注意事项

**编辑好 md 文档先在`hexo server` 运行一下在提交 github**

```js
Markdown 使用时（） { } 都需要转义 否者会报错
```

**每次提交 github 自动构建前，要重启一下 hexo server 然后看看没有报错 ，再进行提交**

## next 主题注意事项

canvas_ribbon 和 tree 需要配合在 CDN 中添加 git 默认不上传 lib 下的文件

## 关于报错

![image-20200725160508488](https://s2.loli.net/2023/01/13/TKmqzHNUjtB581A.png)

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
