---
title: vue-cli3+git-hook实现代码提交前自动eslint验证和格式化
date: 2021-04-22 17:30:03
tags:
  - vue-cli
categories: Vue
cnblogs:
  postid: "15393012"
hash: 3d732e94560e88a4eca45b13b420d35bc94386f0b167f50f45b37fe084d73c70
---

## Git Hook

> 官方文档：https://cli.vuejs.org/zh/guide/cli-service.html#git-hook
> 在安装@vue/cli-service 之后, 也会安装 yorkie，它会让你在 package.json 的 gitHooks 字段中方便地指定 Git hook：

```json
{
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.{js,vue}": ["vue-cli-service lint", "git add"]
  }
}
```

## 注意

> yorkie fork 自 husky 并且与后者不兼容。

### lint-staged 需要安装 否则会报找不到 lint-staged 命令

```bash
yarn add lint-staged --dev
```

再次 commit 时会看到这样的提示

```bash
git commit -m "Update"
 > running pre-commit hook: lint-staged
[STARTED] Preparing...
[SUCCESS] Preparing...
[STARTED] Running tasks...
[STARTED] Running tasks for *.{js,vue}
[STARTED] vue-cli-service lint
[SUCCESS] vue-cli-service lint
[SUCCESS] Running tasks for *.{js,vue}
[SUCCESS] Running tasks...
[STARTED] Applying modifications...
[SUCCESS] Applying modifications...
[STARTED] Cleaning up...
[SUCCESS] Cleaning up...
[dev 486fef8] Update
 2 files changed, 2 insertions(+), 2 deletions(-)
```

### `commit`时有警告

```bash
⚠ Some of your tasks use `git add` command. Please remove it from the config since all modifications made by tasks will be automatically added to the git commit index.
```

意思是将`git add`删除 因为 lint-staged 会将格式化的后的代码自动添加到当前 commit 中

## 使用 husky

因为 yorkie 无法向后兼容 所以建议直接使用 husky 做 git hook
自动安装配置 lint-staged 和 husky

```bash
npx mrm@2 lint-staged
```

修改 package.json

```json
"lint-staged": {
    "*.{js,vue}": ["vue-cli-service lint"]
  }
```

再次 commit 时会看到这样的提示

```bash
$ git commit -m "Update"
[STARTED] Preparing...
[SUCCESS] Preparing...
[STARTED] Running tasks...
[STARTED] Running tasks for *.{js,vue}
[STARTED] vue-cli-service lint
[SUCCESS] vue-cli-service lint
[SUCCESS] Running tasks for *.{js,vue}
[SUCCESS] Running tasks...
[STARTED] Applying modifications...
[SUCCESS] Applying modifications...
[STARTED] Cleaning up...
[SUCCESS] Cleaning up...
[master c33d119] Update
 1 file changed, 1 insertion(+), 1 deletion(-)
```

## 自动 eslint 验证和格式化

如果项目创建时没有 选择 linter / formatter config 需要设置一个标准让 eslint 执行格式化
正常有三种标准可以选择

```bash
ESLint + Airbnb config
ESLint + Standard config
ESLint + Prettier
```

简单的方法想使用哪个标准 使用 vue-cli 创建一个新项目选择对应的标准然后跟现在的项目对比看看缺了些什么
下面简单说下各个标准的配置和需要的插件

### Airbnb

下载插件

```bash
 npm install --save-dev @vue/eslint-config-airbnb
```

修改 eslintConfig

```json
"eslintConfig": {
    ...
    "extends": [
      ...
      "@vue/airbnb"
    ],
  },
```

### Standard

下载插件

```bash
 npm install --save-dev @vue/eslint-config-standard
```

修改 eslintConfig

```json
"eslintConfig": {
    ...
    "extends": [
      ...
      "@vue/standard"
    ],
  },
```

### Prettier

下载插件

```bash
 npm install --save-dev @vue/eslint-config-prettier@6.0.0  eslint-plugin-prettier@3.3.1 prettier@2.2.1
```

修改 eslintConfig

```js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 如果强烈要自定义规则，否则不需要添加下面代码 
    'prettier/prettier': [
      'warn',
      {
        printWidth: 80,
        semi: true,
        singleQuote: false,
        trailingComma: 'es5',
        jsxBracketSameLine: true,
        arrowParens: 'avoid',
        insertPragma: true,
        tabWidth: 2,
        useTabs: false,
        bracketSpacing: true,
        endOfLine: 'auto'
      }
    ]
  }
};

```
#### 关于vscode-prettier

添加.prettierrc 和 修改vscode-prettier规则 会改变 prettier 的默认规则，可能会出现与eslint-config-prettier规则不一致问题 (注意：'prettier/prettier'选项将合并并覆盖任何带有`.prettierrc`文件的配置集)

> 建议 ：不修改 eslintConfig 中的规则 ，  不添加.prettierrc ， 不修改 vscode-prettier 规则 ，保持统一风格

如果非要自定义风格 需要保持 eslintConfig  规则和 .prettierrc 统一风格，或干脆排除 .prettierrc

```
"prettier/prettier": ["error", {}, {
   // 排除  .prettierrc  防止规则合并
  "usePrettierrc": false
}]
```