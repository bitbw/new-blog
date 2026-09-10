---
title: ReactRouterDom常见问题汇总
date: 2021-11-13T11:42:33.000Z
tags:
  - ReactRouterDom
categories: React
hash: a935d04ed51b3411efe290ac339f9d8f8260a6a4683a077cde729f7f64f2f565
cnblogs:
  postid: '15766107'
---

## react-router-dom v6.0

### 基础用法

```js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "../styles/global.css";

import Layout from "../containers/Layout";
import Home from "../pages/Home";
import Login from "../containers/Login";
import RecoveryPassword from "../containers/RecoveryPassword";
import NotFound from "../pages/NotFound";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/recovery-password"
            element={<RecoveryPassword />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
```

### 中类组件的用法

自定义 withRouter 包装类组件

```js
// in hocs.js
function withNavigation(Component) {
  return (props) => <Component {...props} navigate={useNavigate()} />;
}

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

// in BlogPost.js
class BlogPost extends React.Component {
  render() {
    let { id } = this.props.params;
    // ...
  }
}

export default withParams(BlogPost);
```

### 嵌套路由

App.jsx

```js
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          {/* 嵌套路由 */}
          <Route path="/*" element={<Main />}>
            <Route path="userInfo" element={<UserInfo />}>
              <Route path="detail" element={<UserDetail />}></Route>
            </Route>
            <Route path="test" element={<Test />}></Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
```

main.jsx

```js
import React, { Component } from "react";
import { Outlet } from "react-router-dom";

export default class Main extends Component {
  render() {
    return (
      <div>
        Main
        <Outlet />
      </div>
    );
  }
}
```
