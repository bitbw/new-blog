---
title: GitHub Actions 的使用
date: 2021-04-23 10:37:38
tags:
  - GitHub Actions
  - github
  - ci/cd
categories: Github
cnblogs:
  postid: "15392422"
hash: 24d86764c72165769991c506925929b4368bcc63fc28449f0961bb7210a78d68
---

## 自动部署：GitHub Actions

阮一峰关于 GitHub Actions 的教程： <http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html>

> 注意：因为部署插件不断更新需要根据新的插件改相应配置

### 生成 **token** 秘钥

> 官网：<https://docs.github.com/en/actions/reference/encrypted-secrets>
>
> 注意：github-pages-deploy-action V4 开始不需要添加 token

### 添加配置文件

- 在项目目录下新建`.github\workflows`
- 随便命名一个 yml 配置文件 我的命名`main.yml`
- yml文件 具体配置填写见 [文档](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions) 或下面示例

### 填写配置

#### 示例

```yaml
# 工作流名称，不设置的话默认取配置文件名
name: Build and Deploy
# 指定触发 workflow 的条件
# 指定触发事件时，可以限定分支或标签
# 当前是 只有 branches 分支上触发 push 事件时才执行工作流任务
on:
  push:
    branches:
      - main
# 工作流执行的一个或多个任务
jobs:
  # 任务名称
  build-and-deploy:
    # 任务运行的容器类型（虚拟机环境）
    runs-on: ubuntu-latest
    # 任务执行的步骤
    steps:
      # 步骤名称
      - name: Checkout 🛎️    # 拉取代码
        # 使用的操作 actions，可以使用公共仓库，本地仓库，别人的仓库的action
        uses: actions/checkout@v2 # 将代码拷贝到虚机中
      # 设置 nodejs 版本
      - name: SetNodeVersion
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      # nodejs 版本检查
      - name: NodeCheck
        run: node -v
      - name: Install and Build 🔧 # This example project is built using npm and outputs the result to the 'build' folder. Replace with the commands required to build your project, or remove this step entirely if your site is pre-built.
        run: |
          npm ci
          npm run build
        # 构建发布 Github pages
      - name: Deploy 🚀
        # 使用github-pages-deploy-action: https://github.com/JamesIves/github-pages-deploy-action/tree/master
        uses: JamesIves/github-pages-deploy-action@v4.2.2
        with:
          # 存储库中要部署的文件夹。
          # 该步骤会将项目中 FOLDER 指定文件夹下的文件推送到 BRANCH 分支，作为Github Pages 部署的内容。
          branch: gh-pages # The branch the action should deploy to.
          folder: dist # The folder the action should deploy.
```

#### 关于 github-pages-deploy-action

注意：

- JamesIves/github-pages-deploy-action@master 无法使用，继续使用会报错

- github-pages-deploy-action V4 开始不需要添加 token ，如果添加会报 128 错误

- github 关于 128 错误的解答：<https://github.com/JamesIves/github-pages-deploy-action/issues/624>

##### github-pages-deploy-action@v2

```yaml
name: GitHub Actions Build and Deploy Demo
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Build and Deploy
        uses: JamesIves/github-pages-deploy-action@releases/v2
        env:
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          BASE_BRANCH: master
          BRANCH: gh-pages
          FOLDER: public
          BUILD_SCRIPT: npm install && npm run build
```

##### github-pages-deploy-action@v4

```yaml
name: GitHub Actions Build and Deploy Demo
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Install and Build 🔧
        run: |
          npm install
          npm run build
      - name: Deploy
        # JamesIves/github-pages-deploy-action@4.1.1 not need token
        uses: JamesIves/github-pages-deploy-action@4.1.1
        with:
          branch: gh-pages
          folder: public
```

## GitHub Pages

### 创建

<https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site>

## 常用 GitHub-Actions 配置

### 通过 ssh 命令 连接远程服务器并部署

use :[appleboy/ssh-action@master](https://github.com/marketplace/actions/ssh-remote-commands)

```yml
# This is a basic workflow to help you get started with Actions
name: CICD

# Controls when the workflow will run
on:
  # Triggers the workflow on push or pull request events but only for the master branch
  push:
    branches: [ master ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  cicd_job:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v3
      # ssh link remote server and executing script
      - name: executing remote ssh commands using password
        uses: appleboy/ssh-action@master
        env:
          WELCOME: "executing remote ssh commands using password"
          SERVER_HOME: "node-express-server" 
        with:
          host: ${{ secrets.DC_HOST }}
          username: ${{ secrets.DC_USER }}
          password: ${{ secrets.DC_PASS }}
          port: 22
          envs: WELCOME,SERVER_HOME
          script: |
            echo $WELCOME 
            echo whoami 
            whoami  
            echo git version
            git  --version 
            echo node version
            node -v
            echo npm version
            npm -v
            cd ~ 
            echo ~ ls
            ls -la 
            echo $SERVER_HOME ls
            cd $SERVER_HOME
            ls -la 
            npm run deploy  
         
```

#### 问题

 使用 appleboy/ssh-action@master 有可能会报 npm 或 node 命令找不到的情况
 最好在 usr/bin 建立一个[node相关命令的软连接](https://blog.bitbw.top/Nodejs/Linux%E7%B3%BB%E7%BB%9F%E5%AE%89%E8%A3%85Nodejs/)
