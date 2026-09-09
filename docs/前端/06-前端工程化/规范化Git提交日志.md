---
title: 规范化Git提交日志（Commitizen + husky + Git hooks ）
date: 2022-01-14T21:06:00.000Z
tags:
  - 前端工程化
categories: Git
hash: a396e17a7ecf3b48450e5ff161802c9043aadd117493412530ce2dcdbf25c485
cnblogs:
  postid: '15931436'
---

转载自：https://juejin.cn/post/7038550916106027044

commit message 应该清晰明了，说明本次提交的目的，但是很多人在提交 git 信息的时候，为了图方便，大多都会简单的写一下，开发一时爽，维护火葬场。 清晰且统一的提交风格，有利于团队的协作和后期的维护，本文分享了我们如何通过限制代码提交的规范。

# 一、配置自己的提交规范

```JavaScript
// 安装commitizen
npm install -g commitizen

// commitizen根据不同的`adapter`配置commit message
npm install -g cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

配置完成后，在你本地进入任何的 git repository， 使用 `git cz` 代替 `git commit` 都会出现选项，用来生成符合格式的 Commit message，如下图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88224b4fdeee491faf7beeb3a60a079b~tplv-k3u1fbpfcp-watermark.awebp?)

# 二、自定义提交规范

> 以下讲的式项目中的自定义提交规范，全局配置参考[：这篇大佬的文章](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_34249367%2Farticle%2Fdetails%2F88817593)

自定义提交规范，我们需要用到 `cz-customizable`。

> `cz-customizable` 和 `cz-conventional-changelog` 一样，都是 commitize n 的 adapter，但是 `cz-customizable` 支持一定程度上的自定义

1. 安装 `npm i cz-customizable --save-dev`

2. 将以下配置添加到 `package.json`中

   ```json
   "config": {
      "commitizen": {
        "path":"node_modules/cz-customizable"
      }
    }

   ```

3. 项目根目录下创建 `.cz-config.js` 自定义提示文件

   ```JavaScript
   module.exports = {
     // 可选类型
     types:[
       { value: 'feat',     name: 'feat:      新功能'},
       { value: 'fix',      name: 'fix:       修复'},
       { value: 'docs',     name: 'docs:      文档变更'},
       { value: 'style',    name: 'style:     代码格式（不影响代码运行的变动）'},
       { value: 'refactor', name: 'refactor:  重构（既不是增加feature）,也不是修复bug'},
       { value: 'pref',     name: 'pref:      性能优化'},
       { value: 'test',     name: 'test:      增加测试'},
       { value: 'chore',    name: 'chore:     构建过程或辅助工具的变动'},
       { value: 'revert',   name: 'revert:    回退'},
       { value: 'build',    name: 'build:     打包'}
     ],

     // 步骤
     messages: {
       type: '请选择提交的类型；',
       customScope: '请输入修改的范围（可选）',
       subject: '请简要描述提交（必填）',
       body: '请输入详细描述（可选）',
       footer: '请选择要关闭的issue（可选）',
       confirmCommit: '确认要使用以上信息提交？（y/n）'
     },

     // 跳过步骤
     skip: ['body', 'footer'],

     // 默认长度
     subjectLimit: 72
   }

   ```

4. 此时，我们执行 `git cz` 的时候即可按照自己配置的规范，进行选项信息的填写，如下图

   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6295ba68b744044b6f25df980c1fc2b~tplv-k3u1fbpfcp-watermark.awebp?)

# 三、husky + Git hooks 配置提交校验

1. Git Hooks

> 整体的 hooks 非常多,但是我们用的比较多的其实只有两个
>
> 1. `commit-msg`
>    - 由 `git commit` 和 `git merge` 调用
>    - 可以使用 `git commit --no-verify` 绕过
> 2. `pre-commit`
>    - 由 `git commit` 调用
>    - 可以使用 `git commit --no-verify` 绕过
>    - 在获取建议的提交日志消息和进行提交之前被调用

1. husky

> husky 是一个 Git Hook 工具 husky 的具体使用可以参考[：这篇大佬文章](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F366786798)

## 1、使用 `husky + commitlint` 检查提交 message 是否符合规范

> 在前面的配置中，我们已经可以实现使用 `git cz` 调出规范选项，进行规范的 message 的编辑；
>
> 但是如果我们忘记使用 `git cz`, 直接使用了 `git commit -m "my commit"`, message 信息依然会被提交上去，项目中会出现不规范的提交 message
>
> 因此我们需要 husky + commit-msg + commitlint 校验我们的提交信息是否规范。

#### 安装配置 commitlint

1. 安装依赖 `npm install --save-dev @commitlint/config-conventional @commitlint/cli`

2. 创建 `commitlint.config.js` 文件

   ```JavaScript
   module.exports = {
     extends: ['@commitlint/config-conventional'],
     // 定义规则类型
     rules: {
       // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
       'type-enum': [
         2,
         'always',
         [
           'feat', // 新功能
           'fix', //  修复
           'docs', // 文档变更
           'style', // 代码格式（不影响代码运行的变动）
           'refactor', // 重构（既不是增加feature）,也不是修复bug
           'pref', // 性能优化
           'test', // 增加测试
           'chore', // 构建过程或辅助工具的变动
           'revert', // 回退
           'build' // 打包
         ]
       ],
       // subject 大小写不做校验
       'subject-case': [0]
     }
   }

   ```

   > 注意：这里这个文件需要保存为 utf-8 的格式，否则可能出现错误
   >
   > ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f66c138924240bf815b72ec1501dfa9~tplv-k3u1fbpfcp-watermark.awebp?)

#### 安装配置 husky

1. 安装依赖 `npm install husky --save-dev`

2. 启动 hooks, 生成 .husky 文件夹 `npx husky install`

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10702def9941474795f38e713b964baa~tplv-k3u1fbpfcp-watermark.awebp?)

3. 在 package.json 中生成 prepare 指令 `npm set-script prepare "husky install"`

   > 注意：这个需要 npm > 7.0 版本 可以使用 `npm install -g npm` 升版本

   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e558cf1d6dbb4fd294dc6c8339a75723~tplv-k3u1fbpfcp-watermark.awebp?)

4. 执行 prepare 指令 `npm run prepare`

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cad34a2c7ec4b35b584389b2c28bde3~tplv-k3u1fbpfcp-watermark.awebp?)

5. 添加 commitlint 的 hook 到 husky 中，`commit-msg` 时进行校验

   `npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`

   添加完成后： ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d97921ab22b44f3b17f112ea54a5ae6~tplv-k3u1fbpfcp-watermark.awebp?)

6. 此时，不符合规范的 commit 将不会被允许提交，我们的任务也完成啦！测试如下图：

   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9202f5299b1f44ca8f2df2d1a3f9a09c~tplv-k3u1fbpfcp-watermark.awebp?)

## 2、pre-commit 检验当前代码是否有 ESLint 错误

我们期望在代码被提交之前，可以执行 `npx eslint --ext .js,.ts,.vue src` 指令来检测代码是否规范

#### pre-commit 检测

1. 添加 commit 时的 hook，`pre-commit` 时运行 npx eslint --ext .js,.ts,.vue src

   `npx husky add .husky/pre-commit "npx eslint --ext .js,.ts,.vue src"`

   结果如下图：

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15d3db83d48344d79a847f8f5ebe4818~tplv-k3u1fbpfcp-watermark.awebp?)

2. 此时提交代码，如果项目中有错误，无法提交，想要提交代码，必须解决所有的错误信息

   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5524af2ef569450aa04b933a35291bbf~tplv-k3u1fbpfcp-watermark.awebp?)

#### lint-staged 自动修复格式错误

> `lint-staged` 可以让你当前的代码检查**只检查本次修改更新的代码，并在出现错误的时候，自动修复并推送**
>
> `lint-staged` 无需安装，生成项目时，vue-cli 已经帮我们安装了

1. 修改 `package.json` 配置

```json
  "lint-staged": {
  "src/**/*.{js,ts,vue}": [
    "eslint --fix",
    "git add ."
  ]
  }

```

2. 如上配置，每次它在你本地 commit 之前，校验你所提的内容是否符合你本地配置的 eslint 规则

   1. 符合规则，提交成功
   2. 不符合规则，他会自动执行 `eslint --fix` 尝试帮你自动修复 2.1 修复成功，则会自动帮你把修复好的代码提交； 2.2 修复失败，提示你错误，让你修复好才可以提交代码；

3. 配置 `.husky/pre-commit` 文件

   ```shell
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"

   npx lint-staged
   ```

## 常见问题

### commitlint 不支持 emoji 表情怎么办

不是很完美的解决 可以借鉴下

.cz-config.js

```js
types: [
  { value: "✨feat", name: "feat:      新功能" },
  { value: "🐛fix", name: "fix:       修复" },
  { value: "📚docs", name: "docs:      文档变更" },
  { value: "💎style", name: "style:     代码格式（不影响代码运行的变动）" },
  {
    value: "📦refactor",
    name: "refactor:  重构（既不是增加feature）,也不是修复bug",
  },
  { value: "🚀pref", name: "pref:      性能优化" },
  { value: "🚨test", name: "test:      增加测试" },
  { value: "🛠chore", name: "chore:     构建过程或辅助工具的变动" },
  { value: "⚙️revert", name: "revert:    回退" },
  { value: "♻️build", name: "build:     打包" },
];
```

commitlint.config.js

```js
module.exports = {
  // extends: ["@commitlint/config-conventional"], 去除基本设置
  // 定义规则类型
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    "type-enum": [
      2,
      "always",
      [
        "✨feat", // 新功能
        "🐛fix", //  修复
        "📚docs", // 文档变更
        "💎style", // 代码格式（不影响代码运行的变动）
        "📦refactor", // 重构（既不是增加feature）,也不是修复bug
        "🚀pref", // 性能优化
        "🚨test", // 增加测试
        "🛠chore", // 构建过程或辅助工具的变动
        "⚙️revert", // 回退
        "♻️build", // 打包
      ],
    ],
    // subject 大小写不做校验
    "subject-case": [0],
  },
};
```

### 使用 husky 在 git commit 时直接使用 commitizen

1. 安装项目依赖 commitizen

```bash
    yarn add -D commitizen
```

2. 添加 githook

```bash
npx husky add .husky/prepare-commit-msg "exec < /dev/tty &&  node_modules/.bin/cz --hook || true"
```

效果不是很好 不如直接 `npx cz`
commitizen 官方： https://github.com/commitizen/cz-cli#optional-install-and-run-commitizen-locally
