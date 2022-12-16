---
title: webpack教程(5)
date: 2021-01-02 16:24:55
tags:
  - Webpack
  - Webpack-cli
categories: Webpack
cnblogs:
  postid: "15393022"
hash: 1c68433b02c69bf36b44f3da136c087d2eb7eca3b6ed0a990d8c538f73add0cd
---

# webpack 入门

## 介绍

webpack 是一个模块打包器，它本身主要打包 JavaScript 模块，结合它的生态中的一些 loader 可以实现对很多其他资源的打包，例如 less、sass、图片、es6 转 es5、.vue 等等文件资源都可以。

使用 webpack，我们最终就能实现类似于 VueCLI 这个工具提供给我们的功能：

- 打包 JavaScript
- 打包 css
- 打包 图片
- 打包 less
- 打包 .vue 资源
- ....
- 开发阶段的 Web 服务
- 代码热更新
- 打包部署命令
- 。。。。

我们之所以能使用到 VueCLI 这么方便的工具，一切都归功于 webpack。

webpack 出来之前，还有一些别的构建工具：

- **grunt**
- **gulp**
- 百度的 fis
- PARCEL
- rollup
- ......

现在 webpack 已经被各大主流前端框架作为自己的脚手架工具的基层，例如：

- Vue：Vue CLI
- React：crate-react-app
- Angular：angular-cli
- 。。。。

为什么要学习 webpack？

如果你需要定制这些脚手架工具，那么最好了解一点儿 webpack 相关的内容，例如对项目进行打包优化，配置开发工具模式，。。。。一些更高级的使用方式。

![image-20191122114402722](https://bitbw.top/public/img/my_gallery/image-20191122114402722.png)

打包 -> 打包结果 -> 浏览器就可以识别运行。

- 官网：https://webpack.js.org/
  - 官方教程：https://webpack.js.org/guides/
  - 官方 API 参考文档：https://webpack.js.org/api/
  - 官方的中文文档链接： https://webpack.docschina.org/
- GitHub：https://github.com/webpack/webpack

## Hello World

> 目标：体验 webpack 的使用

一、准备

1、创建 `demo1` 练习项目

2、创建 `index.js`

> 现在必须叫 `index.js`，之后可以通过配置文件修改

3、创建 `foo.js`

4、创建 `index.html`

二、安装并配置 webpack 到项目中

1、创建 `package.json` 文件（保存安装包的依赖信息）

2、安装 webpack 到项目的开发依赖中

```bash
# yarn add --dev webpack webpack-cli 或者 yarn add -D webpack webpack-cli

# npm install -D webpack webpack-cli
npm install --save-dev webpack webpack-cli
```

> 建议把开发工具打包相关的包的依赖信息保存到 `devDependencies` 中，其实就是一个归类，都安装包到项目中，有利于阅读，更清晰。

3、将 package.json 的 `scripts` 中新增

![image-20191122121632366](https://bitbw.top/public/img/my_gallery/image-20191122121632366.png)

三、打包

```bash
npm run build
```

> npm 就会找到 package.json 中的 `build` 配置项，运行 webpak 构建打包。

正确的话你应该可以看到：

```
$ npm run build

> demo1@1.0.0 build C:\Users\LPZ\Desktop\FE88\webpack-demos\demo1
> webpack

Hash: 893a9c400f1f92ab6974
Version: webpack 4.41.2
Time: 96ms
Built at: 2019-11-22 12:19:00
  Asset       Size  Chunks             Chunk Names
main.js  976 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./src/index.js + 1 modules 95 bytes {0} [built]
    | ./src/index.js 34 bytes [built]
    | ./src/foo.js 61 bytes [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

webpack 默认会找到 `src/index.js` 作为打包的入口，然后从入口分析所有的依赖：

- a 依赖了 b
- b 依赖了 c
- c 依赖 d
- 。。。。
- 所有依赖的文件

将它们编译构建处理，最终生成一个默认名字叫 `main.js` 文件写入 `dist` 目录。

四、加载执行

在你 HTML 文件中加载打包的结果 `dist/main.js`，访问测试。

## 配置文件

webpack 打包的入口和出口具有默认规则，如果想要自定义，或者其他一些更高级功能配置，那么我们就需要使用它的配置文件了。

1、在项目根目录创建 `webpack.config.js` 并写入

```js
/**
 * webpack 配置文件
 * 该文件必须导出一个对象
 * 对象中声明 webpack 的配置项
 * 注意：webpack 是基于 Node.js 开发运行的一个构件工具，它的打包运行的时候会来执行这个文件得到导出的配置对象
 * 所以你要知道：这里使用的都是 Node.js 中的代码相关语法
 */
const path = require("path");

module.exports = {
  /**
   * 入口配置
   */
  entry: "./src/index.js",

  /**
   * 出口配置
   */
  output: {
    // __dirname 可以动态的获取当前文件所属目录的绝对路径
    // path 是 Node 中一个专门处理路径的一个模块
    // 它的 join 方法转么用来拼接路径，
    path: path.join(__dirname, "./dist"),

    // path: 'C:\\Users\\LPZ\\Desktop\\FE88\\webpack-demos\\demo1\\dist', // 打包的结果目录，默认是 dist，必须是一个绝对路径
    // path: './dist/', // 打包的结果目录，默认是 dist，必须是一个绝对路径
    filename: "bundle.js", // 打包的结果文件名，默认叫 main.js
  },
};
```

2、然后修改 `package.json` 文件中的 `build` 配置项（非必须）

![image-20191122124307295](https://bitbw.top/public/img/my_gallery/image-20191122124307295.png)

> webpack 会自动加载执行名字叫 `webpack.config.js` 的配置文件，如果你使用了别的名字，那么就在这里自定义.

3、打包

```bash
npm run build
```

## 关于 npm scripts

推荐阅读：[阮一峰 - npm scripts 使用指南](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

我们安装到项目中的 webpack，手动的方式需要这样来使用：

## 打包模式 mode

> 官方文档： https://webpack.js.org/configuration/mode/

mode 用来配置打包模式，有两种模式可选：

- development 开发模式
  - 更快的编译速度
- production 生产模式
  - 相比开发模式构建速度慢，拥有更好的编译结果
  - 例如代码压缩

建议开发过程使用开发模式，发布上线使用生产模式。

![image-20191122155129511](https://bitbw.top/public/img/my_gallery/image-20191122155129511.png)

## 打包 CSS

1、安装

```bash
npm install --save-dev style-loader css-loader
```

2、修改打包配置文件

![image-20191122152632937](https://bitbw.top/public/img/my_gallery/image-20191122152632937.png)

3、打包测试

## 打包图片

1、安装

```bash
npm install --save-dev file-loader
```

2、配置

![image-20191122153520233](https://bitbw.top/public/img/my_gallery/image-20191122153520233.png)

3、打包配置

## 设置 HtmlWebpackPlugin

为了解决打包之后的路径问题，我们也必须把 HTML 文件也打包到 dist 目录中，然后运行 dist 中的 HTML 文件，这才是正确的方式。

1、安装

```bash
npm install --save-dev html-webpack-plugin
```

2、配置

```js
...
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    ...
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: '管理输出'
+     })
+   ]
  };
```

> 关于 HTMLwebpackplugin 更多内容，请参考： https://github.com/jantimon/html-webpack-plugin

3、打包测试

## 自动清除 dist 目录

建议每次打包之前把 dist 目录删除，每次都生成最新的干干净净的内容。

1、安装

```bash
npm install --save-dev clean-webpack-plugin
```

2、配置

```js
...
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  ...
  plugins: [
    ...
    new CleanWebpackPlugin(),
  ]
}
```

## 打包字体文件

还是使用 file-loader，只需要增加一个配置规则即可：

![image-20191122162620802](https://bitbw.top/public/img/my_gallery/image-20191122162620802.png)

## 打包 Less

1、安装

```bash
# 安装过的就不用重新安装了
npm install less less-loader style-loader css-loader --save-dev
```

2、配置

![image-20191122163446652](https://bitbw.top/public/img/my_gallery/image-20191122163446652.png)

3、打包测试

## ES6 转 ES5

为了让代码中的 ES6 能运行在低版本浏览器，我们需要把 ES6 转为 ES5 向下兼容。

Babel 是一个专门将 ES6 转 ES5 的编译工具。

### 基本使用

1、安装

```bash
npm install -D babel-loader @babel/core @babel/preset-env webpack
```

2、配置

![image-20191122165529066](https://bitbw.top/public/img/my_gallery/image-20191122165529066.png)

3、打包测试

它只能把基本的语法转换兼容处理，例如：

- const
- let
- 箭头函数
- 解构赋值
- 。。。

当时它不会处理一些 API 方法，例如：

- 字符串的 includes 方法
- 数组的
  - find
  - findIndex
  - includes
  - 。。。。

### API 兼容处理

1、安装

```bash
npm install --save @babel/polyfill
```

2、配置

![image-20191124090523101](https://bitbw.top/public/img/my_gallery/image-20191124090523101.png)

3、打包测试

### 开启缓存

当代码文件比较多的时候，babel 打包非常耗时，我们建议开启缓存用以提高打包的效率。

![image-20191124091122427](https://bitbw.top/public/img/my_gallery/image-20191124091122427.png)

## 增加 source maps

> 建议阅读：[An Introduction to Source Maps](https://blog.teamtreehouse.com/introduction-source-maps)

![image-20191124093220937](https://bitbw.top/public/img/my_gallery/image-20191124093220937.png)

## 使用 watch 监视模式

在 package.json 文件中新增一个 scripts 脚本：

![image-20191124095723565](https://bitbw.top/public/img/my_gallery/image-20191124095723565.png)

## 使用 webpack-dev-server

- 开启一个 Web 服务器
- 监视打包
- 自动刷新浏览器
- 。。。。

1、安装

```bash
npm install --save-dev webpack-dev-server
```

2、配置

![image-20191124100620633](https://bitbw.top/public/img/my_gallery/image-20191124100620633.png)

> 在 `webpack.config.js` 中新增的配置项

![image-20191124100646425](https://bitbw.top/public/img/my_gallery/image-20191124100646425.png)

> 在 `package.json` 文件中新增 NPM Scripts 脚本

3、打包测试

```bash
npm run serve
```

## 热更新

webpack-dev-server 默认是刷新整个页面实现更新。我们有一种更好的方式：热更新，可以在不刷新页面的情况下更新内容变化，效率更高。

![image-20191124101715767](https://bitbw.top/public/img/my_gallery/image-20191124101715767.png)

> 在 webpack 配置文件中

> 提示：如果修改了配置文件，必须重启打包才能生效。

## 打包 Vue

1、安装

```bash
npm install -D vue-loader vue-template-compiler
```

2、配置

![image-20191124104029319](https://bitbw.top/public/img/my_gallery/image-20191124104029319.png)

3、打包测试

## 配置可以省略的后缀名

webpack 默认只支持省略：

- .wasm
- .mjs
- .js
- .json

等文件的后缀名。

如果想要让其支持其它的可省略的后缀名，需要单独配置。

![image-20191124110450652](https://bitbw.top/public/img/my_gallery/image-20191124110450652.png)

## 配置路径别名

在 Vue CLI 项目中，使用过一个路径别名：`@`，它表示 `src` 的路径。

![image-20191124111510567](https://bitbw.top/public/img/my_gallery/image-20191124111510567.png)

## 使用 ESLint

ESLint 专门用于 JavaScript 代码格式校验工具。

- 作者：
  - 《JavaScript 高级程序设计》
  - 《深入理解 ECMAScript 6》
  - ESLint
  - 。。。

1、安装

```bash
npm install eslint eslint-loader --save-dev
```

2、配置 webpack 配置文件

![image-20191124115208034](https://bitbw.top/public/img/my_gallery/image-20191124115208034.png)

> 在 webpack 配置文件的 module.rules 中新增

3、配置生成 eslint 配置文件

在终端下执行：

```bash
# 如果你是 macOS 后者 Linux 系统，则使用 ./node_modules/.bin/eslint.cmd --init
.\node_modules\.bin\eslint.cmd --init
```

然后就是在终端中根据向导完成配置：

```
$ .\node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint?
  To check syntax only
  To check syntax and find problems
> To check syntax, find problems, and enforce code style
```

```
$ .\node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use?
> JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these
```

```
$ .\node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use?
  React
> Vue.js
  None of these
```

```
$ .\node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? Vue.js
? Does your project use TypeScript? (y/N) n
```

```
$ .\node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? Vue.js
? Does your project use TypeScript? No
? Where does your code run? (Press <space> to select, <a> to toggle all, <i> to invert selection)
>(*) Browser
 ( ) Node
```

```
$ .\node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? Vue.js
? Does your project use TypeScript? No
? Where does your code run? Browser
? How would you like to define a style for your project?
> Use a popular style guide
  Answer questions about your style
  Inspect your JavaScript file(s)
```

```
$ .\node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? Vue.js
? Does your project use TypeScript? No
? Where does your code run? Browser
? How would you like to define a style for your project? Use a popular style guide
? Which style guide do you want to follow?
  Airbnb: https://github.com/airbnb/javascript
> Standard: https://github.com/standard/standard
  Google: https://github.com/google/eslint-config-google
```

```
$ .\node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? Vue.js
? Does your project use TypeScript? No
? Where does your code run? Browser
? How would you like to define a style for your project? Use a popular style guide
? Which style guide do you want to follow? Standard: https://github.com/standard/standard
? What format do you want your config file to be in?
> JavaScript
  YAML
  JSON
```

```
$ .\node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? Vue.js
? Does your project use TypeScript? No
? Where does your code run? Browser
? How would you like to define a style for your project? Use a popular style guide
? Which style guide do you want to follow? Standard: https://github.com/standard/standard
? What format do you want your config file to be in? JavaScript
Checking peerDependencies of eslint-config-standard@latest
The config that you've selected requires the following dependencies:

eslint-plugin-vue@latest eslint-config-standard@latest eslint@>=6.2.2 eslint-plugin-import@>=2.18.0 eslint-plugin-node@>=9.1.0 eslint-plugin-promise@>=4.2.1 eslint-plugin-standard@>=4.0.0
? Would you like to install them now with npm? (Y/n) y
```

### 自定义配置校验规则

ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：

- `"off"` 或 `0` - 关闭规则
- `"warn"` 或 `1` - 开启规则，使用警告级别的错误：`warn` (不会导致程序退出)
- `"error"` 或 `2` - 开启规则，使用错误级别的错误：`error` (当被触发的时候，程序会退出)

详细的规则说明请查阅： https://eslint.bootcss.com/docs/rules/ 。

也可以在代码中使用注释临时控制代码格式校验：

```
/* eslint eqeqeq: "off", curly: "error" */
```

在这个例子里，[`eqeqeq`](https://eslint.bootcss.com/docs/user-guide/rules/eqeqeq) 规则被关闭，[`curly`](https://eslint.bootcss.com/docs/user-guide/rules/curly) 规则被打开，定义为错误级别。你也可以使用对应的数字定义规则严重程度：

```
/* eslint eqeqeq: 0, curly: 2 */
```

更多配置，建议参考： https://eslint.bootcss.com/docs/user-guide/configuring/ 。

## 在 Vue CLI 创建的项目中配置 webpack

优化。
