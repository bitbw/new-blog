---
title: Webpack注意事项
date: 2021-02-18 13:31:29
tags:
  - Webpack
  - Webpack-cli
categories: Webpack
cnblogs:
  postid: "15393024"
hash: 4e3d09fdf66e38cbbcc7ef21f5a26e24ad95947aa572499e6f2c5740a6a98ca6
---

## html-webpack-plugin 报错

### Error: The loader didn't return html

报错原因：[Webpack v5.22.0`破坏了 HTMLWebpackLoader ](https://github.com/jantimon/html-webpack-plugin/issues/1603)

解决方案： package.json 中 html-webpack-plugin 版本号是`"^4.5.0"` 直接更新至`5.1.0`

### Error: Automatic publicPath is not supported in this browser

设置 webpack.config.js 中 output 中 publicPath: '' 为空字符串
