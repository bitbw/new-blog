---
title: 模拟一个MVVM框架-Vue实现思路
date: 2019-12-14T21:18:01.000Z
tags:
  - vue
categories: Vue
cnblogs:
  postid: '15393043'
hash: b0ff5c7ba9e8174e8d974c6f47fb5b2fec6dc1ad31a702a1020e00f5206f0127
---

## MVVM 框架介绍

M（Model，模型层 ），
V（View，视图层），
VM（ViewModel，视图模型，V 与 M 连接的桥梁）

MVVM 框架实现了数据双向绑定
当 M 层数据进行修改时，VM 层会监测到变化，并且通知 V 层进行相应的修改
修改 V 层则会通知 M 层数据进行修改
MVVM 框架实现了视图与模型层的相互解耦
![Vue双向绑定原理MVVM](https://bitbw.top/public/img/my_gallery/Vue双向绑定原理MVVM.png)

<!-- more -->

## 几种双向数据绑定的方式

- 发布-订阅者模式（backbone.js）

  - 一般通过 pub、sub 的方式来实现数据和视图的绑定，但是使用起来比较麻烦

- 脏值检查(angular.js)

  - angular.js 是通过脏值检测的方式比对数据是否有变更，来决定是否更新视图。类似于通过定时器轮训检测数据是否发生了改变。

- 数据劫持

  - Vue.js 则是采用数据劫持结合发布者-订阅者模式的方式。通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
    注意：vuejs 不兼容 IE8 以以下的版本

![1576331348832](https://bitbw.top/public/img/my_gallery/1576331348832.png)

## Vue 实现思路

- 实现一个 Compiler 模板解析器，能够对模版中的指令和插值表达式进行解析,并且赋予不同的操作
- 实现一个 Observer 数据监听器，能够对数据对象的所有属性进行监听
- 实现一个 Watcher 观察者，将 Compile 的解析结果，与 Observer 所观察的对象连接起来，建立关系，在 Observer 观察到对象数据变化时，接收通知，同时更新 DOM
- 创建一个公共的入口对象，接收初始化的配置并且协调上面三个模块，也就是 vue

![1576329836998](https://bitbw.top/public/img/my_gallery/1576329836998.png)

## Complier

```js
/**
 * Compile(解析器) 专门负责解析模板内容
 */
class Compile {
  // 接收vue中传进来的el 和 vue实例
  constructor(el, vm) {
    //判断传入的是dom对象还是选择器
    //根节点对象
    this.el = typeof el === "string" ? document.querySelector(el) : el;
    //vm实例
    this.vm = vm;
    if (this.el) {
      /**
       * 文档碎片化
       */
      // 1. 把el中所有的子节点都放到内存中
      let fragement = this.nodeFragement(this.el);
      // console.dir(fragement);
      // 2. 在内存中编译文档碎片
      this.compile(fragement);
      // 3. 把fragement 添加到dom中
      this.el.appendChild(fragement);
    }
  }
  /**
   * 核心方法
   */
  // 把el中所有的子节点都放到内存中
  nodeFragement(node) {
    // 创建一个fragement  fragement 相当于预编译将渲染dom放在内存中进行
    let fragement = document.createDocumentFragment();
    // 把el的子节点挨个添加到文档碎片中
    let childNodes = node.childNodes;
    this.toArray(childNodes).forEach((item) => {
      // 已经将所有节点都添加到文档碎片中
      fragement.appendChild(item);
    });
    return fragement;
  }
  // 在内存中编译文档碎片
  compile(fragement) {
    let childNodes = fragement.childNodes;
    this.toArray(childNodes).forEach((node) => {
      // 判断节点是文本节点还是元素节点
      // console.dir(node)
      if (this.isElementNode(node)) {
        // 如果是元素节点
        this.compileElementNode(node);
      }
      if (this.isTextNode(node)) {
        // 如果是文本节点
        this.compileTextNode(node);
      }
      // 判断节点内是否还有子节点 如果还有就递归排查
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }
  // 编译元素节点
  compileElementNode(node) {
    // console.log('编译元素节点');
    // console.dir(node);
    // 获取所有属性集合转化数组
    let attributes = node.attributes;
    this.toArray(attributes).forEach((attribute) => {
      // console.dir(attribute)
      // 属性名
      let attributeName = attribute.name;
      // console.log(attributeName);
      // 属性值
      let attributeValue = attribute.value;
      // 判断是否是指令
      if (this.isDirective(attributeName)) {
        let type = attributeName.slice(2);
        //  判断是否是v-on指令
        if (this.isEventDirective(type)) {
          //使用解析工具 使用解析工具能够更好的解耦
          conpileUtils.eventConpile(node, this.vm, attributeValue, type);
        } else {
          //使用解析工具能够更好的解耦
          conpileUtils[type](node, this.vm, attributeValue);
        }
      }
    });
  }
  // 编译文本节点
  compileTextNode(node) {
    // console.log('编译文本节点');
    // 调用conpileUtils插值表达式解析器
    conpileUtils.mustache(node, this.vm);
  }

  /**
   * 工具方法
   */
  // 转化数组
  toArray(arr) {
    // 将伪数组转化为数组
    return [].slice.call(arr);
  }
  // 判断是否元素节点
  isElementNode(node) {
    // nodetype 属性 1元素节点 3文本节点
    return node.nodeType === 1;
  }
  // 判断是否文本节点
  isTextNode(node) {
    // nodetype 属性 1元素节点 3文本节点
    return node.nodeType === 3;
  }
  //判断是不是v-开头
  isDirective(attributeName) {
    return attributeName.startsWith("v-");
  }
  // 判断是不是on指令事件指令
  isEventDirective(type) {
    return type.split(":")[0] === "on";
  }
}
/**
 * conpile解析工具 能够更好的解耦方便后期维护
 * 把所有跟解析有关的工具就放到这里
 */
let conpileUtils = {
  // 把下面的一坨分配到这个工具里
  //   if (type ==='text') {
  //     // document.body.textContent
  //     node.textContent = this.vm.$data[attributeValue]
  //   }
  //   if (type ==='html') {
  //     // document.body.innerHTML
  //     node.innerHTML = this.vm.$data[attributeValue]
  //   }
  //   if (type ==='model') {
  //     // document.body.innerHTML
  //     node.value = this.vm.$data[attributeValue]
  //   }
  // 解析普通指令
  // text
  // expr 就是data中绑定的属性名，也就是v-xxx=的值
  text(node, vm, expr) {
    node.textContent = this.getVmValue(vm, expr);
    //当值改变时会调用watcher中的updata，updata会调用回调函数并把新旧值作为实参传入
    //使用了订阅者模式每次new Watcher的时候都会讲实例存到Dep.subs中 当值发生改变会统一调用实例的updata方法
    new Watcher(vm, expr, (newValue) => {
      // 拿到新值更新视图
      node.textContent = newValue;
    });
  },
  // hmtl
  html(node, vm, expr) {
    node.innerHTML = this.getVmValue(vm, expr);
    //当值改变时会调用watcher中的updata，updata会调用回调函数并把新旧值作为实参传入
    //使用了订阅者模式每次new Watcher的时候都会讲实例存到Dep.subs中 当值发生改变会统一调用实例的updata方法
    new Watcher(vm, expr, (newValue) => {
      // 拿到新值更新视图
      node.innerHTML = newValue;
    });
  },
  // model
  model(node, vm, expr) {
    node.value = this.getVmValue(vm, expr);
    let that = this;
    // 监听输入框的input事件 当发生改变时就让 vm.$data[expr] = 输入值
    node.addEventListener("input", function () {
      // 调用setVmValue 方法,对象类型也能设置
      that.setVmValue(vm, expr, this.value);
    });
    //当值改变时会调用watcher中的updata，updata会调用回调函数并把新旧值作为实参传入
    //使用了订阅者模式每次new Watcher的时候都会讲实例存到Dep.subs中 当值发生改变会统一调用实例的updata方法
    new Watcher(vm, expr, (newValue) => {
      // 拿到新值更新视图
      node.value = newValue;
    });
  },
  // 解析事件指令
  eventConpile(node, vm, expr, type) {
    // 分割事件名
    let eventName = type.split(":")[1];
    // 判断是否有methods并且有内部处理的方法
    let mothod = vm.$methods && vm.$methods[expr];
    // 如果有事件名，并且在methods中声明的处理方法再执行下面的操作
    // 要不然bind就会报错 bind只能给函数调用
    if (eventName && mothod) {
      // 给当前节点注册事件，使用vue实例的事件，并且将this指向vue实例
      node.addEventListener(eventName, vm.$methods[expr].bind(vm));
    }
  },
  // 解析文本节点插值表达式，小胡子语法
  mustache(node, vm) {
    // 获取节点的文本内容
    let text = node.textContent;
    // console.log(text);
    // 创建一个正则验证 并且将匹配正则的内容分组
    let reg = /\{\{(.+)\}\}/;
    if (reg.test(text)) {
      // RegExp.$1可以获取分组的第一组内容
      let key = RegExp.$1;
      // 配备正则的内容替换为data中的数据
      // 在插值表达式中的数据就是data中的属性名所以紫瑶把key传入getVmValue即可
      node.textContent = text.replace(reg, this.getVmValue(vm, key));
      //当值改变时会调用watcher中的updata，updata会调用回调函数并把新旧值作为实参传入
      //使用了订阅者模式每次new Watcher的时候都会讲实例存到Dep.subs中 当值发生改变会统一调用实例的updata方法
      new Watcher(vm, key, (newValue) => {
        // 拿到新值更新视图
        node.textContent = text.replace(reg, newValue);
      });
    }
  },
  // 设计一个方法用于解析data中的普通数据类型和复杂数据类型
  getVmValue(vm, expr) {
    let data = vm.$data;
    expr.split(".").forEach((key) => {
      // 在这里如果是单纯字符串就只会遍历一次
      // 如果是对象就会遍历两次第一次data会变成key
      // 第二次data就会等于每一项的值
      data = data[key];
    });
    return data;
  },
  setVmValue(vm, expr, value) {
    let data = vm.$data;
    let arr = expr.split(".");
    arr.forEach((key, index) => {
      // 当item不是arr中最后一个的时候
      // debugger
      if (index < arr.length - 1) {
        // 让data变成最后需要设置的对象
        data = data[key];
      } else {
        // 是最后一个的时候就是需要设置的属性了
        data[key] = value;
      }
    });
  },
};
```

## Observer

```js
class Observer {
  constructor(data) {
    this.data = data;
    this.walk(data);
  }
  /**
   * 核心方法
   */
  // 遍历data把每个属性或属性中的属性都添加劫持
  walk(data) {
    // 如果没有data或者data不是一个对象就return， 不需要劫持
    if (!data || typeof data !== "object") {
      return;
    }
    // 遍历属性
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
      // 优化:如果data中的数据时对象那就直接用自己在递归劫持一遍
      // 如果就是简单数据类型,进来后会直接return掉
      this.walk(data[key]);
    });
  }
  // 用来劫持的方法
  defineReactive(data, key, value) {
    let that = this;
    // 在每个属性中创建一个dep用来监听数据改变
    let dep = new Dep();
    Object.defineProperty(data, key, {
      configurable: true, //当且仅当该属性为 true 时，该属性描述符才能够被改变
      enumerable: true, //当且仅当该属性的为true时，该属性才才能够被遍历（就是被枚举）
      get() {
        // 如果有Dep.target中不是null
        // 就把Dep.target(watcher)添加到当前的Dep实例的订阅者列表中
        Dep.target && dep.addSub(Dep.target);
        console.log(`${key}属性被访问了`, value);
        return value;
      },
      set(newValue) {
        console.log(`${key}属性被设置了`, newValue);
        value = newValue;
        //优化:如果新值是个对象就用walk在劫持一遍
        //不是那也不用担心，方法就直接被return了
        that.walk(newValue);
        //当值发生改变调用watcher的updata方法,催动视图更新
        //这里使用Dep的通知方法，通知每个订阅者（每个watcher实例）调用自己的updata方法
        dep.notify();
      },
    });
  }
}
```

## Watcher

```js
/**
 * 创建一个Watcher 用于关联Observer和Compile
 */
class Watcher {
  // vm就是vue实例，expr是data中的key，cd是需要执行的回调函数
  constructor(vm, expr, cd) {
    this.vm = vm;
    this.expr = expr;
    this.cd = cd;
    // 把当前的watcher 实例存到 Dep.target中
    Dep.target = this;
    // getVmValue 会进到observe中的get中 所以在get中就可以访问到 Dep.target
    // 把旧值(初始值)存起来, 在updata中用来对比
    this.oldValue = this.getVmValue(vm, expr);
    // 进到get中存储完当前watcher实例后，清空Dep.target方便下次存储
    Dep.target = null;
  }
  /**
   * 数据更新调用updata方法
   */
  upData() {
    let oldValue = this.oldValue;
    /**
     * 关于这里为什么是新值,因为调用这个方法就说明数据已经更新了
     * 这里传进来的vm就是更新后的vm了,所以调用getVmValue就拿到新值了
     */
    let newValue = this.getVmValue(this.vm, this.expr);
    // 如果新值和旧值不相对，就调用cd 回调函数将newValue和oldValue传进去
    if (newValue !== oldValue) {
      this.cd(newValue, oldValue);
    }
  }
  // 设计一个方法用于解析data中的普通数据类型和复杂数据类型
  // 将complie中的方法复制过来用
  getVmValue(vm, expr) {
    let data = vm.$data;
    expr.split(".").forEach((key) => {
      // 在这里如果是单纯字符串就只会遍历一次
      // 如果是对象就会遍历两次第一次data会变成key
      // 第二次data就会等于每一项的值
      data = data[key];
    });
    return data;
  }
}
/**
 * 订阅者、发布者模式
 * 创建一个Dep对象用于管理这个订阅者也就是每个watcher实例
 * 并且在改变后通知每个订阅者
 */

class Dep {
  constructor() {
    // 用于储存所有订阅者
    this.subs = [];
  }
  // 新增订阅者方法
  addSub(watcher) {
    // 新增订阅者放到数组中
    this.subs.push(watcher);
  }
  // 通知所有的订阅者更新
  notify() {
    this.subs.forEach((sub) => {
      // 调用upData方法
      sub.upData();
    });
  }
}
```

## 发布-订阅者模式

- 发布-订阅者模式，也叫观察者模式
- 它定义了一种一对多的依赖关系，即当一个对象的状态发生改变的时候，所有依赖于它的对象都会得到通知并自动更新，解决了主体对象与观察者之间功能的耦合。
- 例子：微信公众号
  - 订阅者：只需要要订阅微信公众号
  - 发布者(公众号):发布新文章的时候，推送给所有订阅者
  - 优点：
    - 解耦合
    - 订阅者不用每次去查看公众号是否有新的文章
    - 发布者不用关心谁订阅了它，只要给所有订阅者推送即可

> Dep 中使用的就是发布-订阅者模式

## Vue

```js
/**
 * 创建一个类用于 new Vue的实例
 */
class Vue {
  // 构造函数内部接收new实例传过来的对象vm
  constructor(vm) {
    // 将内部属性通过$属性名挂载
    (this.$el = vm.el), (this.$data = vm.data);
    this.$methods = vm.methods;
    // 调用代理方法
    this.agency(this.$data);
    this.agency(this.$methods);
    new Observer(this.$data);
    if (this.$el) {
      // new Compile 实例用于解析模板内容
      new Compile(this.$el, this);
    }
  }
  // 实现将data，methods中的属性方法代理到vue实例上
  agency(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          // 实际上还是访问data中的数据
          return data[key];
        },
        set(newValue) {
          if (newValue === data[key]) {
            return;
          } else {
            // 实际上还是修改data中的数据调用observer
            data[key] = newValue;
          }
        },
      });
    });
  }
}
```

## html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <div id="app">
      <p v-text="msg"></p>
      <p>{{msg}}</p>
      <p>{{car.brand}}</p>
      <p v-html="msg"></p>
      <input type="text" v-model="msg" />
      <button v-on:click="clickFn">按钮</button>
    </div>
    <script src="./src/watcher.js"></script>
    <script src="./src/observe.js"></script>
    <script src="./src/compile.js"></script>
    <script src="./src/vue.js"></script>
    <script>
      const vm = new Vue({
        el: "#app",
        data: {
          msg: "hello vue111",
          car: {
            brand: "宝马",
          },
        },
        methods: {
          clickFn() {
            // 在vue的methods中this应该指向当前实例
            this.msg = "哈哈";
            this.car.brand = "奔驰";
          },
        },
      });
    </script>
  </body>
</html>
```

## 总结

1.Compile 解析模板时, 模板中挂载的 data 中的数据 ,用到的地方就 注册一个 Watcher （new Watcher）

2.new Watcher 时将自身挂到 Dep.target 上同时将触发 Observer 的一次 get, Observer 的 get 会将判断 Dep 上有无 Watcher 实例，有的话就添加到订阅者 subs 中，然后清空 Dep.target

3.Observer set 方法一但被调用就会触发 dep.notify 方法 发布，notify 方法依次调用 subs（Watcher）的 update 方法 ，更新视图

![image-20211019130049831](https://bitbw.top/public/img/my_gallery/20211019130057.png)
