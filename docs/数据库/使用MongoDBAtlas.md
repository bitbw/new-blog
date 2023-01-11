---
title: 使用 MongoDB Atlas （MongoDB云服务）
date: 2022-12-16T17:30:03.000Z
tags:
  - MongoDB
categories: SQL
hash: 45ddfeea771b0d224e4eee48ca1ad3ed704a6d8044bc85a03ac7da0ea2944885
cnblogs:
  postid: '17041152'
---

[官方文档](https://www.mongodb.com/docs/atlas/getting-started/)

## 创建
[创建](https://www.mongodb.com/docs/atlas/tutorial/create-atlas-account/)

## 链接
[链接](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/)

注意链接地址不要使用文档中的地址要使用 mongodb 提供的地址

```
"mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&w=majority";
```

点击 connect （这里页面不容易出现多刷新几次）
![点击 connect](https://www.mongodb.com/docs/drivers/node/current/includes/figures/atlas_connection_select_cluster.png)
复制提供的链接
![复制](https://www.mongodb.com/docs/drivers/node/current/includes/figures/atlas_connection_copy_string_node.png)

使用 nodejs 链接时也可以查看这个 [文档](https://www.mongodb.com/docs/drivers/node/current/quick-start/)
