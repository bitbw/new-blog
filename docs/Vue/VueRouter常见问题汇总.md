---
title: VueRouter常见问题汇总
date: 2021-11-12 12:07:26
tags:
  - vue-cli
categories: Vue
hash: 13d0371eb4d8d1fd03e685fc51473dd4a3c88b423224dc8442678f0a3f648696
cnblogs:
  postid: "16228080"
---


## 路由可选参数

routerConfig

```js
 {
    path: "/home/mission/:type/:courseid/:missionid",
    name: "Mission",
    props: true,
    component: () =>
        import(
        /* webpackChunkName:'Mission' */
        "@/views/course/mission.vue"
        ),
}

```

### 问题

 传参时如果少传一个参数 那路由地址将无法正常显示

```js
   this.$router.push({
        name: "Mission",
        params: { type: "add", courseid: item.uuid },
      });
```

### 解决

修改 routerConfig

```js
 {
    //  :parmas?  => ? 就是代表参数可选
    path: "/home/mission/:type?/:courseid?/:missionid?",
    name: "Mission",
    props: true,
    component: () =>
        import(
        /* webpackChunkName:'Mission' */
        "@/views/course/mission.vue"
        ),
}
```
