---
title: VueCli常见问题汇总
date: 2021-11-12 12:07:26
tags:
  - vue-cli
categories: Vue
hash: b9b5355d2d853dd7b7689ba5dcc15833f9b5cfe753574d6b8625431b0a10af82
cnblogs:
  postid: "15766342"
---

### 去除 PWA 插件

去除 package.json 中的 PWA 依赖 从新 npm install

```json
 "devDependencies": {
   ...
-    "@vue/cli-plugin-pwa": "^4.4.0",
     ...
 }
```

## ESlint

### ESlint 开启保存校验

vue.config.js

```js

module.exports = {
  ...
  lintOnSave: true,
  ...
}
```

### 关闭部分校验规则

.eslintrc.js

```js
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  // 关闭规则
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": process.env.NODE_ENV === "production" ? "warn" : "off",
    // vue相关加 vue/
    "vue/no-unused-components":
      process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};


```

## 添加 vue-cli 添加 babel

[参考文档](https://blog.csdn.net/qq_37493515/article/details/118628968)

babel.config.js

```js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
```

### package.json

```json
 "dependencies": {
  "core-js": "^3.6.5",    //core-js 是 babel-polyfill 的底层依赖，
 },
 "devDependencies": {
    "@vue/cli-plugin-babel": "~4.5.0",  // 包含  Babel 7 + babel-loader+ @vue/babel-preset-app
    "@vue/cli-plugin-eslint": "~4.4.0", // 跟其他 @vue/cli-plugin 和 @vue/cli-service 相近的版本
    "@vue/cli-service": "~4.4.0",
```

### 容易出现的问题

@vue/cli-plugin-babel 不要直接安装 最好使用与当前项目 @vue/cli-plugin 和 @vue/cli-service 相近的版本
