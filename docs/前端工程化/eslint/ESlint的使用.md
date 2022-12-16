---
title: ESlint的使用
date: 2022-01-27 11:08:59
tags:
  - ESlint
  - prettier
categories: 前端工程化
hash: 2f28f37aa9f69b40b9b58682b4333fe7dea2121cebde6f099b73e48e184d2737
cnblogs:
  postid: "15931410"
---

## 官方网站

[eslint 官网](https://eslint.bootcss.com/docs/user-guide/getting-started)
[eslint-plugin-prettier 官网](https://github.com/prettier/eslint-plugin-prettier#eslint-plugin-prettier-)
[lint-staged 官网](https://www.npmjs.com/package/lint-staged)
[prettier 官网](https://prettier.io/docs/en/cli.html#--write)

## 安装

```bash
npm install eslint --save-dev
```

### 配合 prettier 安装

```bash
npm install eslint eslint-config-prettier eslint-plugin-prettier prettier --save-dev
```

## 初始化配置

```bash
./node_modules/.bin/eslint --init
```

或者

```bash
npx eslint --init
```

根据提示进行配置

```bash
$ npx eslint --init
You can also run this command directly using 'npm init @eslint/config'.
√ How would you like to use ESLint? · style
√ What type of modules does your project use? · none
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · browser
√ How would you like to define a style for your project? · prompt
√ What format do you want your config file to be in? · JavaScript
√ What style of indentation do you use? · tab
√ What quotes do you use for strings? · double
√ What line endings do you use? · unix
√ Do you require semicolons? · No / Yes
A config file was generated, but the config file itself may not follow your linting rules.
Successfully created .eslintrc.js file in C:\ls-project03\miniprogr
```

运行 `eslint --init` 之后，`.eslintrc` 文件会在你的文件夹中自动创建

### 配合 prettier 的配置

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  // 添加 prettier 预设配置
 + extends: ["plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
  // prettier 错误变为警告
  +  "prettier/prettier": ["warn"],
  },
};

```

## 设置排除文件

### .eslintignore

项目目录添加`.eslintignore` 文件,添加需要 eslint 排除的文件 默认排除 node_modules

```
node_modules
```

### .prettierignore

项目目录添加`.prettierignore` 文件,添加需要 prettier 排除的文件 tip:prettier 默认排除 node_modules

```
node_modules
```

## 添加 npm 脚本

package.json

```json
  "scripts": {
   + "lint": "prettier --write .",
   + "lint:js": "eslint --fix .",
  },
```

`prettier --write . ` 修复项目目录下所有文件,``.prettierignore` `会被排除

`eslint --fix . ` 修复项目目录下所有 js 文件,``.eslintignore` `会被排除

## 设置 commit 时自动 lint

安装 husky 和 lint-staged 并自动配置

```bash
npx mrm@2 lint-staged
```

修改 package.json

```json
"lint-staged": {
   - "*.js": "eslint --cache --fix",
   // 使用 prettier 进行 lint
   +"*": "prettier --ignore-unknown --write"
  }
```
