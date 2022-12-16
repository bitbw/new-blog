---
title: WebSocket的简单了解和使用
date: 2020-5-09 08:15:26
tags:
  - 网络应用
categories: 网络应用
cnblogs:
  postid: "15393025"
hash: d51619bbccaf32759716489a30125368fc947eabe7fa82efd9da1d8d0503881b
---

## WebSocket

![img](https://bitbw.top/public/img/my_gallery/bg2017051501.png)

- WebSocket 是一种数据通信协议，类似于我们常见的 http
- 既然有 http，为啥还要 WebSocket
- http 通信是单向的
  - 请求 + 响应
  - 没有请求也就没有响应

初次接触 WebSocket 的人，都会问同样的问题：我们已经有了 HTTP 协议，为什么还需要另一个协议？它能带来什么好处？

<!-- more -->

答案很简单，因为 HTTP 协议有一个缺陷：通信只能由客户端发起。

举例来说，我们想了解今天的天气，只能是客户端向服务器发出请求，服务器返回查询结果。HTTP 协议做不到服务器主动向客户端推送信息。

这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。我们只能使用["轮询"](https://www.pubnub.com/blog/2014-12-01-http-long-polling/)：每隔一段时候，就发出一个询问，了解服务器有没有新的信息。最典型的场景就是聊天室。

轮询的效率低，非常浪费资源（因为必须不停连接，或者 HTTP 连接始终打开）。因此，工程师们一直在思考，有没有更好的方法。WebSocket 就是这样发明的。

WebSocket 协议在 2008 年诞生，2011 年成为国际标准。所有浏览器都已经支持了。

它的最大特点就是，**服务器可以主动向客户端推送信息**，**客户端也可以主动向服务器发送信息**，是真正的**双向平等对话**，属于[服务器推送技术](https://en.wikipedia.org/wiki/Push_technology)的一种。

简单理解：

HTTP 打电话：

- 我问一句
- 你回答一句
- 没有提问就没有回答，即便对方主动给你说话，我也是个聋子听不见

WebSocket 打电话：

- 双向对话

![img](https://bitbw.top/public/img/my_gallery/bg2017051502.png)

> HTTP 和 WebSocket 通信模型

其他特点包括：

（1）建立在 TCP 协议之上，服务器端的实现比较容易。

（2）与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段（第 1 次建立连接）采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

（3）数据格式比较轻量，性能开销小，通信高效。

（4）可以发送文本，也可以发送二进制数据。

（5）没有同源跨域限制，客户端可以与任意服务器通信。

（6）协议标识符是`ws`（如果加密，则为`wss`），服务器网址就是 URL。

（7）浏览器专门为 WebSocket 通信提供了一个请求对象 `WebSocket`

```
ws://example.com:80/some/path
```

![img](https://bitbw.top/public/img/my_gallery/bg2017051503.jpg)

## 使用原生 WebSocket（了解）

> 参考文档：
>
> - [MDN - WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

浏览器为 HTTP 通信提供了 `XMLHttpRequest` 对象，同样的，也为 WebSocket 通信提供了一个通信操作接口：`WebSocket`。

通信模型：

- 拨号（建立连接）
- 通话（双向通信）
- 结束通话（关闭连接）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <script>
      // WebSocet 通信模型

      // 1. 拨打电话（建立连接）
      // 注意：wss://echo.websocket.org 是一个在线的测试接口，仅用于 WebSocket 协议通信测试使用
      var ws = new WebSocket("wss://echo.websocket.org");

      // 当连接建立成功，触发 open 事件
      ws.onopen = function (evt) {
        console.log("建立连接成功 ...");

        // 连接建立成功以后，就可以使用这个连接对象通信了
        // send 方法发送数据
        ws.send("Hello WebSockets!");
      };

      // 当接收到对方发送的消息的时候，触发 message 事件
      // 我们可以通过回调函数的 evt.data 获取对方发送的数据内容
      ws.onmessage = function (evt) {
        console.log("接收到消息: " + evt.data);

        // 当不需要通信的时候，可以手动的关闭连接
        // ws.close();
      };

      // 当连接断开的时候触发 close 事件
      ws.onclose = function (evt) {
        console.log("连接已关闭.");
      };
    </script>
  </body>
</html>
```

怎么查看 WebSocket 请求日志：

![1569575005360](https://bitbw.top/public/img/my_gallery/1569575005360.png)

> 朝上的绿色箭头是发出去的消息
>
> 朝下的红色箭头是收到的消息

## Socket.IO（了解体验）

### 介绍

- 原生的 WebSocket 使用比较麻烦，所以推荐使用一个封装好的解决方案：socket.io
- socket.io 提供了服务端 + 客户端的实现
  - 客户端：浏览器
  - 服务端：Java、Python、PHP、。。。。Node.js
- 对于前端开发者来说，只需要关心她的客户端如何使用即可
- 注意：Socket.io 必须前后端配套使用
  - 实际工作中，socket.io 已经成为了各大后端开发的 WebSocket 通信主流解决方案
- [GitHub 仓库](https://github.com/socketio/socket.io)
- [官网](https://socket.io/)

Socket.io 和 WebSocket 就好比它就好比 axios 和 XMLHTTPRequest 的关系。

### 基本使用

官方的 Hello World：<https://socket.io/get-started/chat/>。

服务端代码：

```js
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  socket.on("chat message", function (msg) {
    io.emit("chat message", msg);
  });
});

http.listen(3000, "0.0.0.0", function () {
  console.log("listening on *:3000");
});
```

客户端代码：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font: 13px Helvetica, Arial;
      }
      form {
        background: #000;
        padding: 3px;
        position: fixed;
        bottom: 0;
        width: 100%;
      }
      form input {
        border: 0;
        padding: 10px;
        width: 90%;
        margin-right: 0.5%;
      }
      form button {
        width: 9%;
        background: rgb(130, 224, 255);
        border: none;
        padding: 10px;
      }
      #messages {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      #messages li {
        padding: 5px 10px;
      }
      #messages li:nth-child(odd) {
        background: #eee;
      }
    </style>
  </head>
  <body>
    <!-- 消息列表 -->
    <ul id="messages"></ul>

    <!-- 发送消息的表单 -->
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>

    <!-- SocketIO 提供了一个客户端实现：socket.io.js -->
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
    <script>
      // 建立连接，得到 socket 通信对象
      var socket = io();

      socket.on("connect", () => {
        console.log("建立连接成功了");
      });

      $("form").submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit("chat message", $("#m").val());
        $("#m").val("");
        return false;
      });

      socket.on("chat message", function (msg) {
        $("#messages").append($("<li>").text(msg));
      });
    </script>
  </body>
</html>
```

### 总结

我们只需要关注客户端怎么使用：

- 怎么建立连接
- 怎么发送消息
- 怎么接收消息

建立连接：

```js
const socket = io("连接地址");
```

发送数据：

```js
// 发送指定类型的消息
// 数据可以是任何类型
socket.emit("消息类型", 数据);
```

接收消息：

```js
// 消息类型
// 回调函数参数获取消息数据
socket.on("消息类型", (data) => {
  console.log(data);
});
```

> 消息类型由后端给出，他会告诉你收发消息的类型，就好比 HTTP 接口中的请求路径一样。

利用广播实现多人沟通

```js
//服务器端
io.on("connection", function (socket) {
  socket.broadcast.emit("有用户连接");
  //这条信息会发送给除了当前socket的其他用户
});
```
