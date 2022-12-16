---
title: Nginx学习和常见问题汇总
date: 2021-11-19 09:27:21
tags:
  - Nginx
categories: 工具使用
hash: bf3b6abb5e0e41793fbede8b23cccf6748a5025d6e6dde5193dc75f723d85868
cnblogs:
  postid: "15765975"
---


## Nginx 学习

### **nginx** **常用的命令：**

（1）启动命令

在/usr/local/nginx/sbin 目录下执行 ./nginx

（2）关闭命令

在/usr/local/nginx/sbin 目录下执行 ./nginx -s stop

（3）重新加载命令

在/usr/local/nginx/sbin 目录下执行 ./nginx -s reload

### nginx.conf

```nginx
#============== Nginx 默认配置文件nginx.conf中文详解==============

#定义Nginx运行的用户和用户组
#user  nobody;

#nginx进程数，建议设置为等于CPU总核心数。
worker_processes  1;

#全局错误日志定义类型，[ debug | info | notice | warn | error | crit ]
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#进程pid文件
#pid        logs/nginx.pid;

#配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。（菜鸟教程解释）
#工作模式及连接数上限
events {
    worker_connections  1024;
}

#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {

    #文件扩展名与文件类型映射表
    include       mime.types;

    #默认文件类型
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

　　#设定负载均衡的服务器列表【没有用过】    upstream mysvr {    　　#weigth参数表示权值，权值越高被分配到的几率越大    　　server 192.168.8.1x:3128 weight=5;#本机上的Squid开启3128端口    　　server 192.168.8.2x:80  weight=1;    　　server 192.168.8.3x:80  weight=6;    }
　#【没有用过】
    upstream mysvr2 {    #weigth参数表示权值，权值越高被分配到的几率越大
    　　server 192.168.8.x:80  weight=1;    　　server 192.168.8.x:80  weight=6;    }

    #配置虚拟主机的相关参数，一个http中可以有多个server。
    server {
        listen       80; #监听端口
        server_name  127.0.0.1; #监听地址

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html; #根路径
            index  index.html index.htm; #设置默认页面
        }

        #自己添加
        location /ooaa/ {
            #请求转向mysvr 定义的服务器列表
            proxy_pass http://127.0.0.1:8384/;  #注意：使用代理地址时末尾记得加上斜杠"/"。
            #deny 127.0.0.1;  #拒绝的ip【目前没有用过】
            #allow 172.18.5.54; #允许的ip【目前没有用过】
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```
