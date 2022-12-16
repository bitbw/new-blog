---
title: yarn 和 npm
date: 2018-04-30 18:27:25
tags:
  - 工具使用
  - npm
  - yarn
categories: Nodejs
cnblogs:
  postid: "15393030"
hash: b5a0475f7448115d77637388b08bc53bfd79445a45aad6898d03a7c08c24262f
---

## 关于 npm 和 yarn

npm 和 yarn 都是管理第三方包的。

yarn 相比 npm 稍微快一些。

下面是 npm 和 yarn 常用命令对照表：

```bash
# yarn init
npm init

# yarn add 包名
npm install 包名

# yarn install 或者直接 yarn
npm install

# yarn add -D 包名
npm install -D 包名

# yarn remove 包名
npm uninstall 包名

# yarn global add 包名
npm install --global 包名

# yarn global remove 包名
npm uninstall --global 包名
```

<!-- more -->

在一个项目中，使用哪个包管理工具那你就自始至终都使用这个工具，千万不要混用，否则会导致文件丢失。

如果你想切换项目使用的包管理工具或者你因为混用包管理工具导致项目的模块丢失报错了，使用下面的方式解决：

1、删除 node_modules

2、使用你要使用的包管理工具把所有依赖重新安装一遍

- 如果是 yarn 就直接执行 `yarn` 或者 `yarn install`
- 如果 npm 就执行 `npm install`

3、之后都使用你切换之后的包管理工具进行装包

## 补充：关于 VueCLI 创建项目使用的包管理器

使用 VueCLI 创建项目的时候会帮我们自动装包。

- 如果你的机器只有 npm，则它默认就使用 npm 安装包
- 如果你的机器只有 yarn，则它默认就使用 yarn 安装包

如果你的机器同时存在 npm 和 yarn，则它会提示你使用 npm 还是 yarn 来装包，例如下面这样：

```
Vue CLI v4.1.1
? Please pick a preset: default (babel, eslint)
? Pick the package manager to use when installing dependencies: (Use arrow keys)
> Use Yarn
  Use NPM
```

> Use Yarn：使用 yarn
>
> Use NPM：使用 npm

根据提示选择对应的包管理器工具之后，接下来它就会使用你选择的包管理器工具安装项目依赖。

但是之后你使用 `vue` 命令创建项目的时候，它都会使用你之前选择的包管理工具安装依赖，而不再给你提示选择的机会。

这是因为 VueCLI 默认记住了你第 1 次选择使用的包管理器，是好事儿也是坏事儿。

如果你想要在初始化的时候重新选择使用的包管理工具，那就找到你操作系统用户目录下的 `.vuerc` 将其删除即可。
