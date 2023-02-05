---
title: GitHub Packages 的使用
date: 2022-04-23T10:37:38.000Z
tags:
  - GitHub Packages
  - github
  - ci/cd
categories: Github
---

## GitHub Packages

[GitHub Packages 文档](https://docs.github.com/en/packages)
>学习安全地发布和使用包，将包与代码一起存储，并与您的团队私下或与开源社区公开共享您的包。您还可以使用 GitHub Actions 自动化您的包。
说白的就是 github 注册列表的包管理器 ，而且不光有 npm  还有 Docker、Apache Maven 等

### 收费状况

GitHub Packages 对于公共仓库免费, 私人仓库就得花钱了->[收费状况](https://docs.github.com/en/billing/managing-billing-for-github-packages/about-billing-for-github-packages)

### npm

可以将 github 仓库发到 GitHub Packages 下的 npm 注册列表中, 当然下载包的时候需要使用  registry=<https://npm.pkg.github.com>

#### 发布包

目前来看只能使用 actions 进行发布，

- 首先创建一个github仓库 ，我使用我的[rollup模板](https://github.com/bitbw/rollup-typescript-babel-eslint)创建一个
- 创建 [actions](https://docs.github.com/en/actions/quickstart),现在创建比较简单，点击 Action -> 点击 new workflow -> 在推荐的配置中找到 Publish Node.js Package to GitHub Packages，
- 修改 workflow配置

```yml
# This workflow will run tests using node and then publish a package to GitHub Packages when a release is created
# For more information see: https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages

name: Node.js Package

on:
  push:
    branches:
    - main

jobs:
  publish-gpr:
    env:
      NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}} # 这里不用改
    permissions:
      contents: read
      packages: write # 必须有 packages 的可写权
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 14
          registry-url: https://npm.pkg.github.com/ # 发布到 github 下的 npm 仓库
      - run: npm ci
      - run: npm run build
      - name: Test
        run: |
          echo =============env==============
          env | grep NODE_AUTH_TOKEN
          echo =============ls hla==============
          ls -hla 
          ls dist
      - name: publish
        run: npm publish
```

- 修改一下 package.json 中的name 添加，命名空间 `name": "@bitbw/github-package-test-bitbw",` 我的需要添加`@bitbw/`
- 查看流水线是否完成 ，没有报错说明发包成功了，可以去自己的 packages 列表查看了

#### 下载包

- 在需要下载的目录下创建 .npmrc 添加以下配置

```
registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TODO
```

- _authToken 通过 [创建个人访问令牌获取](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token),需要有read:packages权限才能下载
- 下载 npm install  @bitbw/github-package-test-bitbw
