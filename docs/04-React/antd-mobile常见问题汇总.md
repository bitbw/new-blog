---
title: antd-mobile常见问题汇总
date: 2021-11-12T20:42:35.000Z
tags:
  - antd-mobile
  - antd
categories: React
hash: 60ce5dc1efc6fe2b1cb70e5c67e2e731a09c1ed4de8a10ca61075fc45802e2ac
cnblogs:
  postid: '15765936'
---

## 在 create-react-app 中使用

### antd-mobile 2.0

在 create-react-app 中使用 antd-mobile 需要自定义主题时,需要根据官方模板中的依赖版本进行安装否则会报各种错误!!

github 地址：https://github.com/ant-design/antd-mobile-samples/tree/master/create-react-app

package.json

```json
 // 直接复制到项目中 yarn 更新依赖
"devDependencies": {
    "babel-plugin-import": "^1.2.0",
    "less": "^2.7.3",
    "less-loader": "^4.0.5",
    "react-app-rewired": "^1.2.9"
  }
```

less-loader 不要超过 5.0， react-app-rewired 不要超过 2.0.2-next.0，less@2.7.3
