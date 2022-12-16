---
title: express入门
date: 2022-03-07 17:09:09
tags:
  - express
categories: Nodejs
hash: 4bacb61a4dcc7d4c735bec943e89acde8e9d69ac1fd79534e1035b9d6b068c42
cnblogs:
  postid: "15992790"
---


## Express 应用程序生成器

[官方地址](http://expressjs.com/zh-cn/starter/generator.html)

```bash
npx express-generator --git  -view=ejs  myapp

cd myapp

npm install

npm start

```

## 项目完善

### CORS

app.js

```js
//设置CORS
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin','*'); //当允许携带cookies此处的白名单不能写’*’
  res.header('Access-Control-Allow-Headers','Accept-Ranges, Content-Encoding,  Content-Range, content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); //允许的请求方法
  res.header('Access-Control-Allow-Credentials',true);  //允许携带cookies
  next();
});
```

### 解析 formdata

[使用 multiparty](https://www.npmjs.com/package/multiparty)

```bash
npm install multiparty
```

router

```js
const multiparty = require("multiparty");
outer.post("/xxx", async function (req, res, next) {
  // 获取form
  var form = new multiparty.Form();
  form.parse(req, async function (err, fields, files) {
    /* 
      例子：  客户端发送如下 formData
      
      formData :{
        image : new File([1,2,3],"xx.png"),
        userID:"S12SADXXA"
      }

      files 接收 formData 中的文件 

      files.image[0] = {
        fieldName: "image",
        originalFilename: "xx.png",
        path: "XXX/XXX/XXX/xx.png",
        headers: {
          "content-disposition": "form-data; name=\"image\"; filename=\"xx.png\"",
          "content-type": "application/json",
        },
        size: 26,
      }

      fields 接收非文件字段

      fields.userID[0] = "S12SADXXA"
      */ 
      console.log(fields, files)
  }
})
```
