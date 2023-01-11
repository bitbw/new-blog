---
title: gitlab的使用
date: 2022-01-19T08:58:41.000Z
tags:
  - gitlab
categories: 工具使用
hash: c59604e3674be8b1b94e64fc2f1d29092affaf890784e36f3c431f7e8da8f888
cnblogs:
  postid: '15931420'
---


## 安装

### docker安装

```bash
sudo docker run --detach \
  --hostname gitlab.example.com \
  --publish 8443:443 --publish 8081:80 --publish 10022:22 \
  --name gitlab \
  --restart always \
  --volume $GITLAB_HOME/config:/etc/gitlab \
  --volume $GITLAB_HOME/logs:/var/log/gitlab \
  --volume $GITLAB_HOME/data:/var/opt/gitlab \
  --shm-size 256m \
  gitlab/gitlab-ce:latest
```

注意：端口号映射， 防止端口占用 --publish 8443:443 --publish 8081:80 --publish 10022:22 \
