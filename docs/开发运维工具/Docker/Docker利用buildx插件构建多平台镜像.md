---
title: Docker 利用buildx插件构建多平台镜像
date: 2022-09-06 17:46:42
tags:
  - Docker
categories: 工具使用
---


## 安装 Docker Buildx

[安装 Docker Buildx](https://docs.docker.com/build/buildx/install/)

## 运行 Docker 镜像分发的跨平台模拟器

```sh
docker run --privileged --rm tonistiigi/binfmt --install all
```

## 创建 docker-container 驱动程序的新构建器

```sh
docker buildx create --name container --driver docker-container
```

然后我们应该能够在我们的可用构建器列表中看到它：

```sh
docker buildx ls
```

### 创建项目文件夹添加 Dockerfile

创建文件夹  `mkdir docker_buildx_demo_01` `cd docker_buildx_demo_01`
创建 Dockerfile `touch Dockerfile`

```Dockerfile
# syntax=docker/dockerfile:1 $TARGETPLATFORM 表示目标平台
FROM --platform=$TARGETPLATFORM golang:alpine AS build
ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "I am running on $BUILDPLATFORM, building for $TARGETPLATFORM" > /log
FROM --platform=$TARGETPLATFORM alpine:latest
COPY --from=build /log /log
```

## 单独为个别平台构建镜像并输出文件

[构建多平台镜像](https://docs.docker.com/build/buildx/multiplatform-images/)

```sh
# x86
docker buildx build  --platform linux/amd64 -t docker_buildx_demo:x86 -o type=docker,dest=./docker_buildx_demo_x86.tar  .
# ppc64le
docker buildx build  --platform linux/ppc64le -t docker_buildx_demo:ppc64le -o type=docker,dest=./docker_buildx_demo_ppc64le.tar  .

```

## 各个平台分别加载加载文件

```sh
# x86
 docker load -i docker_buildx_demo_x86.tar
# ppc64le
 docker load -i docker_buildx_demo_ppc64le.tar 
```

## 参考文档

[巧用 Docker Buildx 构建多种系统架构镜像](https://blog.csdn.net/easylife206/article/details/118004740)
