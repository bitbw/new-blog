---
title: Canvas常见问题汇总
date: 2022-07-05T16:43:10.000Z
tags:
  - Canvas
categories: 前端可视化
hash: e32bd1ee3a29a1443fbdb3b0bc7bee658827d3f5c8f56f03307452745564d953
cnblogs:
  postid: '17041147'
---

## drawImage 远端图片再使用 getImageData 时报错  Uncaught (in promise) DOMException: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data

意思是使用的图片跨域了

### 解决

图片 dom 或标签添加属性

```html
  <img id="source" crossorigin="anonymous" src="xxx" />
```

```js
  // DOM
  image.crossorigin = "anonymous"
```

同时图片的静态资源服务器要配合添加允许CORS跨域的请求头

```http
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Accept-Ranges, Content-Encoding,  Content-Range, content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With
Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT
Access-Control-Allow-Origin: *
```
