---
title: Vue常用自定义指令
date: 2021-03-25T10:19:42.000Z
tags:
  - Vue
categories: Vue
cnblogs:
  postid: '15393019'
hash: 841e661a9efb84ac057f34288a8e6eff270968cdfc852ea21cc5fdd1d69755e4
---

Vue 常用自定义指令

## 布局容器布局下的左右托拽指令 v-resize

vue+elementUI 项目 实现 Container 布局容器布局下的左右托拽指令

```js
import Vue from "vue";
const resize = {
  //被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted(el, binding, vnode, oldVnode) {
    //创建一个定位的节点定位到要托拽的节点上
    const resize: HTMLElement = document.createElement("div");
    resize.innerText = "✌";
    const style = {
      position: "absolute",
      top: "0%",
      right: "0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "10px",
      height: "100%",
      overflow: "hidden",
      cursor: "e-resize",
    };
    for (const key in style) {
      if (resize.style.hasOwnProperty(key)) {
        resize.style[key] = style[key];
      }
    }
    el.appendChild(resize);
    //获取binding参数
    const { container = false, percent = 0.5 } = binding.value;
    //容器
    let containerNode = container
      ? document.querySelector(container)
      : el.parentElement;
    //容器宽度
    let clientWidth = containerNode.clientWidth;
    //要托拽节点的位置参数
    let targetPosition = el.getBoundingClientRect();
    //最大可托拽宽度
    let maxWidth = clientWidth * percent;
    //托拽事件
    const handleMove = (e) => {
      let targetWidth = e.clientX - targetPosition.right + targetPosition.width;
      targetWidth > maxWidth ? (targetWidth = maxWidth) : null;
      el.style.flex = `0 0 ${targetWidth}px`;
    };
    //鼠标按下触发托拽
    resize.addEventListener("mousedown", (e) => {
      containerNode.addEventListener("mousemove", handleMove);
    });
    //鼠标抬起清除事件
    containerNode.addEventListener("mouseup", (e) => {
      containerNode.removeEventListener("mousemove", handleMove);
    });
  },
};
Vue.directive("resize", resize);
```

## 拖拽指令 v-drag

### 效果：

![拖拽指令 v-drag ](https://bitbw.top/public/img/my_gallery/%E6%8B%96%E6%8B%BD%E6%8C%87%E4%BB%A4%20v-drag%20.gif)

拖拽指令 v-drag 绑定元素需要定位

```js
export default {
  inserted(el, { value }) {
    el.style.cursor = "move";
    el.onmousedown = function (e) {
      let disx = e.pageX - el.offsetLeft;
      let disy = e.pageY - el.offsetTop;
      // el 的 x y 轴
      let x, y;
      document.onmousemove = function (e) {
        x = e.pageX - disx;
        y = e.pageY - disy;
        el.style.left = x + "px";
        el.style.top = y + "px";
      };
      document.onmouseup = function () {
        // 如果绑定值是函数 移动后调用一下函数并传入 x, y
        if (value && typeof value === "function") {
          value({ x, y });
        }
        // 抬起后取消移动和抬起事件
        document.onmousemove = document.onmouseup = null;
      };
    };
  },
};
```
