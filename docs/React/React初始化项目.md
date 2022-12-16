---
title: React初始化项目
date: 2021-11-21 12:20:03
tags:
  - antd
  - redux
categories: React
hash: 1dd7da676ccd0bf0ea9439a7fa5ca4eea991adb613c0da95efd9063305ab02df
cnblogs:
  postid: "15766317"
---

## 创建项目

```bash
 npx create-react-app antd-demo
```

## 安装 antd

```bash
yarn add antd
```

### 高级配置

```bash
yarn add -D babel-plugin-import react-app-rewired customize-cra less less-loader@5.0.0
```

#### tips

less-loader@5.0.0 下载 5.0.0 防止报错 TypeError: this.getOptions is not a function

#### 修改 peckage.json

```json
 "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
```

#### 新建 config-overrides.js 文件

```js
const { override, fixBabelImports, addLessLoader } = require("customize-cra");
module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    // 主题
    modifyVars: { "@primary-color": "#3acea0" },
  })
);
```

## router

```bash
yarn add react-router-dom
```

## redux

```bash
yarn add redux react-redux redux-thunk
```

```bash
yarn add -D redux-devtools-extension
```

## redux + router 代码

App.jsx

```js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Main from "./pages/Main";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import store from "./redux/store";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<Main />} />
            <Route exact path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
```
