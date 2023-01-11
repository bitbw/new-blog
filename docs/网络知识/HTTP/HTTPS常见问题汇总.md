---
title: HTTPS常见问题汇总
date: 2021-12-28T16:55:17.000Z
tags:
  - HTTPS
categories: 网络应用
hash: 19abd48584960ea3705c8894013d869e3e2caf65df113015fe9739b86927355d
cnblogs:
  postid: '15765959'
---

## 注意事项

### 通过 IP 地址 + https 协议访问服务的问题

通过 IP 地址 + https 协议访问服务在浏览器中会触发 证书不安全警告
在 nodejs 中会提示 `Error [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames: IP: xx.xxx.xx.xx is not in the cert's list`

> PS: HTTPS 的证书通过域名绑定 就只能通过域名访问不要通过 IP 地址来访问
