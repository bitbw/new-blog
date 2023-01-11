---
title: Jenkins的使用
date: 2021-07-02T10:24:03.000Z
tags:
  - Jenkins
  - ci/cd
categories: 工具使用
cnblogs:
  postid: '15392431'
hash: 30d0baa27366cd281e138374c824330ffa0540fa73650cf06240d48909e6fa08
---

## 安装

### Docker

https://www.likecs.com/show-103109.html

### war 包

> 前提：需要 java 环境

```bash
java -jar ./jenkins.war(jenkins.war文件的路径) --Port=8080（端口）
```

## 基于 node 环境构建 react 或 vue 项目

官方教程：https://www.jenkins.io/zh/doc/tutorials/build-a-node-js-and-react-app-with-npm/

### 问题

#### Docker 在 WSL，windows 下出现:Cannot connect to the Docker daemon at unix:///var/run/docker.sock 问题

https://blog.csdn.net/weixin_48031922/article/details/116529198

ps：

-v /var/run/docker.sock:/var/run/docker.sock \

上面这条命令是使容器内系统，可以直接使用当前运行容器的系统的 docker

也就是说 在容器内使用 `docker ps -a `可以看到当前系统中所有运行的容器，包括当前容器本身

> 最佳解决方案是直接在 ubutun 子系统中使用，docker run ...
>
> /var/run/docker.sock:/var/run/docker.sock 就不会出现错误 ，win 上我实在不知道 /var/run/docker.sock 在哪

#### 出现 WorkflowScript: 3: Invalid agent type "docker" specified

下载 `Docker Pipeline` 插件 即可解决

## 使用流水线语法实现构建后上传服务器

基于这篇文章：https://blog.csdn.net/wangzan18/article/details/105864373/

### sshPublisher 文档：

https://www.jenkins.io/doc/pipeline/steps/publish-over-ssh/#-sshpublisher-%20send%20build%20artifacts%20over%20ssh

### 注意点：

#### **Publish over SSH** 插件 ，

配置 **Publish over SSH**

系统管理->系统配置->Publish over SSH

![配置 **Publish over SSH** ](https://bitbw.top/public/img/my_gallery/Publish%20over%20SSH%E9%85%8D%E7%BD%AE.png)

ps:

这里配置的私钥就是使用 ssh 免密登录时生成的私钥

全部了解 ssh 见 我的文章 Linux 命令入门 https://blog.bitbw.top/Linux/Linux%E5%91%BD%E4%BB%A4%E5%85%A5%E9%97%A8/

#### 免密码登录

##### 步骤

- 配置公钥
  - 执行 `ssh-keygen` 即可生成 SSH 钥匙，一路回车即可
- 上传公钥到服务器
  - 执行 `ssh-copy-id -p port user@remote`，可以让远程服务器记住我们的公钥
  - 上传后的公钥在远端用户家目录下`.ssh`文件夹 `authorized_keys` 中

执行`ssh-keygen`后会在当前用户家目录下生成`.ssh`文件夹

```bash
 cd .ssh/
 ll
#total 20
#drwx------  2 bowen bowen 4096 Aug  2 14:34 ./
#drwxr-xr-x 13 bowen bowen 4096 Aug  4 09:24 ../
#-rw-------  1 bowen bowen 3243 Aug  2 14:32 id_rsa
#-rw-r--r--  1 bowen bowen  747 Aug  2 14:32 id_rsa.pub
#-rw-r--r--  1 bowen bowen  222 Aug  2 13:43 known_hosts
```

id_rsa 就是私钥

```bash
cat id_rsa
```

全部复制放到 key 字段中

#### 问题

##### 测试连接报错：jenkins.plugins.publish_over.BapPublisherException: Failed to add SSH key

解决：http://www.wallcopper.com/linux/3689.htmljenkins

无密码 ssh 时报错:jenkins.plugins.publish_over.BapPublisherException: Failed to add SSH key. Message [invalid privatekey: [B@6a581993]
com.jcraft.jsch.JSchException: invalid privatekey, 部分库（如：JSch）不支持 OPENSSH PRIVATE KEY 格式的私钥

1、jenkins 使用 `ssh-keygen -m PEM -t rsa -b 4096` 来生成 key 就可以用了。
-m 参数指定密钥的格式，PEM（也就是 RSA 格式）是之前使用的旧格式

##### ssh-copy-id 上传时报：IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!

解决：https://blog.csdn.net/weixin_44545265/article/details/88362272

文件传输不过去，只需要删除.ssh 目录下的 known_hosts 文件就能传输了
`[root@xx]# rm -rf ~/.ssh/known_hosts`

#### 我的 jenkinsfile

```
pipeline {
    agent {
        docker {
            image 'node:12-alpine'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run buildtest'
                sh 'ls -lha'
            }
        }
	stage('Deploy') {
            steps {
                sshPublisher(publishers: [sshPublisherDesc(configName: 'IPSServer', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''
                echo "dist_temp/ ls"
                ls /home/ipsconfig/deployment/docker_front/product_config/test/dist_temp/
                rm -rf /home/ipsconfig/deployment/docker_front/product_config/test/dist/
                mkdir /home/ipsconfig/deployment/docker_front/product_config/test/dist/
                cp -r /home/ipsconfig/deployment/docker_front/product_config/test/dist_temp/.   /home/ipsconfig/deployment/docker_front/product_config/test/dist/
                echo "dist/ ls"
                ls /home/ipsconfig/deployment/docker_front/product_config/test/dist/
                rm -rf /home/ipsconfig/deployment/docker_front/product_config/test/dist_temp/
                docker restart product-nginx-test
                ''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/home/ipsconfig/deployment/docker_front/product_config/test/dist_temp/', remoteDirectorySDF: false, removePrefix: 'dist', sourceFiles: 'dist/**')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
            }
        }
    }
}
```

#### sshPublisher 显示操作日志

sshPublisher(publishers: [sshPublisherDesc()])内添加 verbose: true

verbose：选择为 Jenkins 控制台启用大量信息 - 仅对帮助追踪问题非常有用。

## 构建触发器

### 使用轮询 SCM 实现收到 git post-commit 即构建

![image-20210818150222789](https://bitbw.top/public/img/my_gallery/%E4%BD%BF%E7%94%A8%E8%BD%AE%E8%AF%A2SCM%20%E5%AE%9E%E7%8E%B0%E6%94%B6%E5%88%B0%20git%20post-commit%20%E5%8D%B3%E6%9E%84%E5%BB%BA-20210818150222789.png)

日程表使用 cron 语法

```
#每15分钟(可能在:07,22,37,52):
H/15 * * * *
每小时前半小时每十分钟一次(三次，可能在:04,14,24)
H(0-29)/10 * * * *
#每两个小时，在每小时后45分钟，从早上9:45开始，下午3:45结束，每周一次:
45 9-16/2 * * 1-5
#在工作日早上8点到下午4点之间每两个小时一次(可能在上午9:38，上午11:38，下午1:38，下午3:38):
H H(8-15)/2 * * 1-5
每月1号和15号每天一次，12月除外:
H H 1,15 1-11 *
```

规则有点难可以使用 cron 在线解析工具：http://cron.qqe2.com/

使用轮询 SCM 检查到 commit 更新 就会触发构建
