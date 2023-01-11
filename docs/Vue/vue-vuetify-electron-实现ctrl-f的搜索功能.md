---
title: vue + vuetify + electron 实现ctrl+f的搜索功能
date: 2021-01-12T15:02:05.000Z
tags:
  - Vue
  - Vuetify
  - Electron
categories: Vue
cnblogs:
  postid: '15393013'
hash: 5d07ba4b3a480dcd58893d3f097b4a8c1742959f6eebaec6c0b5ac311ce63582
---

> 因为在 electron 中没有找到 ctrl+f 调用浏览器搜索的方法 于是借鉴文章自己撸了一个搜索组件

借鉴文章地址：https://www.jb51.net/article/181616.htm

### 效果

![实现ctrl+f的搜索功能](https://bitbw.top/public/img/my_gallery/实现ctrl+f的搜索功能.gif)

<!-- more -->

模板部分

```vue
<v-card class="history-info-drawer">
    <!-- 头部操作栏 -->
      <v-toolbar dense dark color="primary">
        <!-- input -->
        <v-text-field
          type="text"
          hide-details
          prepend-icon="mdi-magnify"
          single-line
          clearable
          placeholder="请输入要搜索的字符串 回车进行定位"
          v-model="searchStr"
          @keyup.enter="e => submit()"
        ></v-text-field>
        <!-- 上下按钮 -->
        <v-btn icon @click="submit('up')">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
        <v-btn icon @click="submit('down')">
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
        <!-- 关闭按钮 -->
        <v-btn icon @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <!-- 内容显示区域 -->
      <v-card-text>
        <div v-html="transitionContent" class="history-info-content"></div>
      </v-card-text>
    </v-card>
```

逻辑部分

```javascript
export default {
  name: "HistoryInfoDrawer",
  props: {
    // 传入的内容字符串
    content: {
      type: String,
      defualt: "",
    },
  },
  data() {
    return {
      //搜索内容
      searchStr: "",
      // 搜索定位
      currentPosition: 0,
      // 经过转换的展示内容
      transitionContent: "",
      // 当前搜索字符串是否是首次定位
      firstPosition: true,
    };
  },
  methods: {
    handleTransitionContent(searchStr) {
      //获取动态变化的搜索词
      if (searchStr !== "" && searchStr) {
        // 将特殊符号转义
        let searchRegExp = searchStr.replace(/(\.|\+|\?|\*)/g, "\\$1");
        //若搜索词不为空，对搜索词进行替换 背景颜色变黄色
        return this.content
          .replace(
            new RegExp(searchRegExp, "g"),
            '<a style="background-color: yellow;"  >' + searchStr + "</a>"
          )
          .replace(/\n/g, "</br>");
      } else {
        return this.content.replace(/\n/g, "</br>");
      }
    },
    // 定位
    handlePosition(flag = "down") {
      // 容器
      const container = document.querySelector(".history-info-content");
      // 获取所有a
      let alist = container.getElementsByTagName("a");
      let aListLength = alist.length;
      // 首次搜索不执行定位的增减
      if (this.firstPosition) {
        flag = "";
      }
      switch (flag) {
        case "down": {
          //定位+1，走满一圈归0
          if (this.currentPosition < aListLength - 1) {
            this.currentPosition += 1;
          } else if (this.currentPosition == aListLength - 1) {
            this.currentPosition = 0;
          }
          break;
        }
        //定位-1，走满一圈归最后一位
        case "up": {
          if (this.currentPosition > 0) {
            this.currentPosition -= 1;
          } else if (this.currentPosition == 0) {
            this.currentPosition = aListLength - 1;
          }
          break;
        }
        default:
          break;
      }
      console.log("Bowen: change ", this.currentPosition);

      if (aListLength != 0) {
        // 当前的定位元素的背景颜色变红
        for (const a of alist) {
          a.style.backgroundColor = "yellow";
        }
        let currentA = alist[this.currentPosition];
        console.log("Bowen: handlePosition -> currentA", currentA);
        currentA && (currentA.style.backgroundColor = "red");
        // 滚动到当前元素
        currentA.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
      this.firstPosition = false;
    },
  },
  watch: {
    searchStr(searchStr) {
      // 输入改变定位清零
      this.currentPosition = 0;
      // 赋值转化后的字符串
      this.transitionContent = this.handleTransitionContent(searchStr);
      // 设置为首次定位
      this.firstPosition = true;
    },
  },
  mounted() {
    // 首次先赋值
    this.transitionContent = this.handleTransitionContent("");
  },
};
```

> 组件使用的是 vuetify ，主要可以看逻辑部分 element 等组件的用法大同小异
