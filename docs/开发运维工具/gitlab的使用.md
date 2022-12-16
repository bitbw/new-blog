---
title: gitlab的使用
date: 2022-01-19 08:58:41
tags:
  - gitlab
categories: 工具使用
hash: e67d3f3f054f135709df59b3842eb87d3370480fda54a172d11ba057abbca908
cnblogs:
  postid: "15931420"
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