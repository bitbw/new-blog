---
title: VueRouter常见问题汇总
date: 2021-11-12T12:07:26.000Z
tags:
  - vue-cli
categories: Vue
hash: 9abff2d5a26fdc614da410e258300acad59c569375d33ffbe3218fd328af807e
cnblogs:
  postid: '16228080'
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
