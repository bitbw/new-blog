---
title: vuetify自定义过度动画createSimpleTransition的使用实现左右抽屉效果
date: 2021-01-11T17:40:14.000Z
tags:
  - Vue
  - Vuetify
categories: Vue
cnblogs:
  postid: '15393016'
hash: 7a612beb43d16c996adeb6d698055aeb3824af5e6b8a79a8a1008f8587851603
---

> 因为 vuetify 中 dailog 只有上下抽屉的效果，想要左右抽屉效果 于是自己写了一个左右抽屉的组件 其中比较难搞的还是样式 和过渡
>
> vuetify 中创建过渡组件的方式：https://vuetifyjs.com/zh-Hans/styles/transitions/#todo-list

实现效果：

<!-- more -->

![vuetfiy抽屉效果](https://bitbw.top/public/img/my_gallery/vuetfiy抽屉效果.gif)

```vue
<template>
  <v-dialog
    class="slide-drawer"
    content-class="my-slide-drawer"
    :value="value"
    @input="(val) => $emit('input', val)"
    scrollable
    width="600px"
    v-bind="$attrs"
    v-on="$listeners"
    transition="my-transition"
    origin="0px 0px"
  >
    <v-card>
      <v-card-title>
        <v-btn icon @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div v-html="content"></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// 导入创建组件方法
import { createSimpleTransition } from "vuetify/lib/components/transitions/createTransition";
// 创建 my-transition 过渡组件  这个组件在模板中的transition属性使用
const myTransition = createSimpleTransition("my-transition");
// 注册组件
import Vue from "vue";
Vue.component("my-transition", myTransition);
// import Dialog from "@/components/common/dialog";
export default {
  name: "HistoryInfoDrawer",
  components: {
    // Dialog
  },
  props: {
    value: {
      type: Boolean,
      defualt: false,
    },
    content: {
      type: String,
      defualt: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.v-dialog__content {
  // 改变dialog布局 靠右
  justify-content: start !important;
}
::v-deep {
  .my-slide-drawer {
    border-radius: 0;
    margin: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 100% !important;
    .v-sheet.v-card {
      border-radius: 0;
    }
  }
  // 添加侧面抽屉效果
  .my-transition {
    // 进入和离开的状态
    &-enter,
    &-leave-to {
      transform: translateX(-800px);
    }
  }
}
</style>
或者=================================
<style lang="scss">
// 添加侧面抽屉效果
.my-transition {
  &-enter,
  &-leave-to {
    transform: translateX(-800px);
  }
}
</style>
```

> 注意事项：样式不能在 scoped 中要不不会生效 或者放到 ::v-deep 中
