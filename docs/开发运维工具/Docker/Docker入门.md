---
title: Docker入门
date: 2021-07-02 10:23:01
tags:
  - Docker
categories: 工具使用
cnblogs:
  postid: "15392412"
hash: 00f7bae4a7ccd6afba84202c9e40eb00b6db4f8ea07376d70d70ae62ea02265f
---

阮一峰教程：

[Docker 入门教程](https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
[Docker 微服务教程](https://www.ruanyifeng.com/blog/2018/02/docker-wordpress-tutorial.html)

## 以 Jenkins 为例的使用过程

下载镜像

```
docker pull jenkins/jenkins
```

启动容器

```
docker run -d -p 8868:8080 -p 10241:50000 -v C:/test/jenkins:/var/jenkins_home -v C:/test/localtime:/etc/localtime --name myjenkins 9927cde587ad
```

创建并启动 Jenkins 容器

**-d 后台运行镜像**

**-p 10240:8080 将镜像的 8080 端口映射到服务器的 10240 端口。**

**-p 10241:50000 将镜像的 50000 端口映射到服务器的 10241 端口**

**-v /var/jenkins\_\*\*mount\*\*:/var/jenkins_mount /var/jenkins_home 目录为容器 jenkins 工作目录，我们将硬盘上的一个目录挂载到这个位置，方便后续更新镜像后继续使用原来的工作目录。这里我们设置的就是上面我们创建的 /var/jenkins_mount 目录 (文件映射)**

**-v /etc/localtime:/etc/localtime 让容器使用和服务器同样的时间设置。**

**--name myjenkins 给容器起一个别名**

查看 jenkins 是否启动成功，如下图出现端口号，就为启动成功了

```
docker ps -l
```

查看 docker 容器日志

```
docker logs myjenkins
```

## Docker-查看镜像仓库中镜像的版本信息

浏览器中查看

直接在浏览器中个输入下面URL格式的地址查询

<https://registry.hub.docker.com/v1/repositories/{docker_img}/tags>

例如：node
<https://registry.hub.docker.com/v1/repositories/node/tags>
