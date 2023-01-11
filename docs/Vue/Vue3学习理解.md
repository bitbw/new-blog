---
title: Vue3学习理解
date: 2020-12-24T14:35:01.000Z
tags:
  - vue
categories: Vue
cnblogs:
  postid: '15393014'
hash: 33ed9ba6ab254d0df4b1938bc6bb154272d4b51da9987fa4ecfb3e3e0b0698fd
---

# vue3 新特性

> 整理的比较好的文档：https://www.jianshu.com/p/1fd73091e2e4

直接看代码可以直接看 [实践 demo](#demo " Vue3 + TypeScript ")

## 组合式 API

vue3 中加入了组合式 ，这个功能的作用是将单个 vue 组件的，逻辑部分也能自由拆分组合，更深层次的实现解耦和高复用性

vue2 如果单个 vue 文件逻辑部分过大 ，我们往往 需要单独用一个 js 文件或 ts 文件存放 逻辑（函数）并且为了使用 vue 组件上的响应式属性不得不将 vue 实例传进这个函数中，总有一种怪怪的感觉；

```js
// vue2  单独存放逻辑的文件
export default function handle(vue,xx){
    vue.yy = xx ;
    ....
}
```

## 响应式的改变

> 响应式转换是“深层”的——它影响所有嵌套 property。在基于 [ES2015 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的实现中，返回的 proxy 是**不**等于原始对象的。建议只使用响应式 proxy，避免依赖原始对象。

- ref 可以用于创建所有数据类型的响应式数据 需要.value 访问 （对象类型数据配合 reactive 使用）
- reactive 只能用于创建对象数据类型的相应式数据 不需要.value 就直接可以访问 深度响应
- toRefs 用于给 prop 添加响应数据，需要.value 访问

### 基础 api

#### reactive

返回对象的响应式副本

使用:

> 可以直接给对象添加任何属性都是响应式的 ，但不能直接赋值对象

```js
let person = reactive({
  name: "zhangshan",
  age: 18,
});
// 有效
person.sex = "男";
// 无效
person = { ...person, ...{ sex: "男" } };
```

#### isReactive

检查对象是否是 reactive 创建的响应式 proxy。

#### readonly

除了只读以外跟 reactive 一样，但只读也代表了响应式没有意义了

#### isReadonly

检查对象是否是由 readonly 创建的只读 prox

#### shallowReactive 和 shallowReadonly

与上面的差别就是指对第一层属性响应，再深度的则不响应

#### isProxy

检查对象是否是由 reactive 或 readonly 创建的 proxy。

### Refs

#### ref

> 接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property `.value`。
>
> 也就是相当于解决了 reactive 只能作用对象类型，和只能添加属性不能直接修改对象的不足
>
> 对象类型数据配合 reactive 使用

```js
const count = ref(0);
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
// 对象类型
let person = ref(
  reactive({
    name: "zhangshan",
    age: 18,
  })
);
person.value = reactive({
  name: "lisi",
  age: 28,
});
```

#### unref

返回使用 ref 响应数据的 value （不是原始数据）

```js
const flag = ref(
  reactive({
    number: 0,
    name: "flag",
  })
);
flag.value.number++;
console.log(
  unref(flag),
  "unref(flag) === flag.value",
  unref(flag) === flag.value
); // 1 true
```

### setup（组合式的核心）

#### 定义：

> 个人理解 :setup 相当于一个盒子 （组合式的核心） ，将`methods`、`watch`、`computed`、`data`的数据都在这里进行组合
>
> 而`methods`、`watch`、`computed`、`data` 的数据，可以分别用不同的 js 文件生成，再导入到 vue 当文件组件中，或 setup 所在文件中

> 在 Vue3 中，定义 `methods`、`watch`、`computed`、`data`数据 等都放在了 `setup()` 函数中 ，(实现了逻辑的拆分)
>
> [官网地址](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#setup-%E7%BB%84%E4%BB%B6%E9%80%89%E9%A1%B9)

#### 使用

setup 方法接收两个参数 ：

- prop
- context 上下文对象也就是 this （当前 vue 实例）

```js
import { ref, onMounted, watch, toRefs, computed } from "vue";
export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // 使用 `toRefs` 创建对 props 中的 `user` property 的响应式引用
    const { user } = toRefs(props);
    const repositories = ref([]);
    console.log(props); // { user: '' }

    return {}; // 这里返回的任何内容都可以用于组件的其余部分
  },
  // 组件的“其余部分”
};
```

更多用法详见：[setup.ts](###setup.ts)

### setup 语法糖` <scritp setup>`

可以使用`<script setup>` 标签 代替 setup（）

```js
import { ref } from "vue";

export default {
  setup() {
    const count = ref(0);
    const inc = () => count.value++;

    return {
      count,
      inc,
    };
  },
};
```

以上代码可以写成下面的代码

```vue
<template>
  <button @click="inc">{{ count }}</button>
</template>

<script setup>
import { ref } from "vue";

export const count = ref(0);
export const inc = () => count.value++;
</script>
```

#### 使用限制：

> 由于模块执行语义的不同，内部代码`<script setup>`依赖于 SFC 的上下文。当移至外部`.js`或`.ts`文件中时，可能会给开发人员和工具带来混乱。因此，**`<script setup>`**不能与该`src`属性一起使用。

**个人感觉比较麻烦 还不如正常的使用 setup**

## Global API 全局 API

### `createApp` 创建整个应用的实例

> 3.x 添加`createApp` 方法用来创建应用的根 防止数据间的相互污染 [官方文档地址](https://v3.cn.vuejs.org/guide/migration/global-api.html#%E4%B8%80%E4%B8%AA%E6%96%B0%E7%9A%84%E5%85%A8%E5%B1%80-api-createapp)

应用实例暴露当前全局 API 的子集，经验法则是，任何全局改变 Vue 行为的 API 现在都会移动到应用实例上，以下是当前全局 API 及其相应实例 API 的表：

| 2.x 全局 API               | 3.x 实例 API (`app`)                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vue.config                 | app.config                                                                                                                                          |
| Vue.config.productionTip   | _removed_ ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#config-productiontip-removed))                                          |
| Vue.config.ignoredElements | app.config.isCustomElement ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#config-ignoredelements-is-now-config-iscustomelement)) |
| Vue.component              | app.component                                                                                                                                       |
| Vue.directive              | app.directive                                                                                                                                       |
| Vue.mixin                  | app.mixin                                                                                                                                           |
| Vue.use                    | app.use ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#a-note-for-plugin-authors))                                               |
| Vue.prototype              | app.config.globalProperties ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#vue-prototype-replaced-by-config-globalproperties))   |

所有其他不全局改变行为的全局 API 现在被命名为 exports，文档见[全局 API Treeshaking](https://v3.cn.vuejs.org/guide/migration/global-api-treeshaking.html)。

### 全局 API Treeshaking 将一部分$xxx 和 指令 按需导入使用

> Vue.nextTick() 将废弃 使用 导入方式如下

```js
import { nextTick } from "vue";

nextTick(() => {
  // 一些和DOM有关的东西
});
```

使用 render 语法中 可以使用如下 api 按需导入

```js
import { h, Transition, withDirectives, vShow } from "vue";

export function render() {
  return h(Transition, [withDirectives(h("div", "hello"), [[vShow, this.ok]])]);
}
```

## teleport 指定标签父节点

#### 定义

> teleport 可以将组件生成的 dom 节点 ，转移到其他 dom 下作为其子节点
>
> 让我们修改 `modal-button` 以使用 `<teleport>`，并告诉 Vue “**Teleport** 这个 HTML **到**该‘**body**’标签”。

```vue
app.component('modal-button', { template: `
<button @click="modalOpen = true">
        Open full screen modal! (With teleport!)
    </button>

<teleport to="body">								// teleport 的 to属性就是作为哪个dom的字节的
      <div v-if="modalOpen" class="modal">
        <div>
          I'm a teleported modal! 
          (My parent is "body")
          <button @click="modalOpen = false">
            Close
          </button>
        </div>
      </div>
    </teleport>
`, data() { return { modalOpen: false } } })
```

#### Props：

- `to` - `string`。需要 prop，必须是有效的查询选择器（独一无二的类名或 id 或属性）或 `HTMLElement` (如果在浏览器环境中使用)。指定将在其中移动 `<teleport>` 内容的目标元素

```html
<!-- 正确 -->
<teleport to="#some-id" />
<teleport to=".some-class" />
<teleport to="[data-teleport]" />

<!-- 错误 -->
<teleport to="h1" />
<teleport to="some-string" />
```

- `disabled` - `boolean`。此可选属性可用于禁用 `<teleport>` 的功能，这意味着其插槽内容将不会移动到任何位置，而是在您在周围父组件中指定了 `<teleport>` 的位置渲染。

```html
<teleport to="#popup" :disabled="displayVideoInline">
  <video src="./my-movie.mp4">
</teleport>
```

请注意，这将移动实际的 DOM 节点，而不是被销毁和重新创建，并且它还将保持任何组件实例的活动状态。所有有状态的 HTML 元素 (即播放的视频) 都将保持其状态。

## 片段（支持多根节点）

Vue 3 现在正式支持了多根节点的组件，也就是片段！

在 3.x 中，组件可以包含多个根节点！但是，这要求开发者显式定义 attribute 应该分布在哪里。

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

> 因为 2.x 只有一个根节点 $attrs 就会绑定到根节点上，现在3.x会有多个根节点，所以需要定义$attrs 需要绑定到到哪个节点上

## `v-model` 的改变

2.x 使用 input + value 实现 v-model , 3.x 里使用使用 `modelValue`（ 自己定义字段名与 update:后面的字段一致即可 ，默认值是`modelValue`） 作为 prop 和 `update:modelValue` 作为事件

```js
app.component("my-component", {
  props: {
    title: String,
  },
  emits: ["update:title"],
  template: `  <input 
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)">
  `,
});
```

```html
<my-component v-model:title="bookTitle"></my-component>
```

> 注意点：v-model 后面需要加对应的 update 后的的字段名 习惯于 2.x 语法后 前几次会忘记加

并且可以使用多个 v-model 只需要在 v-model 后面加上对应的 prop 字段名即可

### `v-model` 修饰符

在 2.x 中 v-model 的修饰符有.trim`、`.number`和`.lazy，

在 3.x 中我们可以自定义修饰符，比如 `v-model:title.capitalize="bar"`

在子组件中 prop 中 `titleModifiers`中可以接收到 `capitalize：ture ` 再做对应处理后

prop 中修饰符的属性名为 ： `arg + "Modifiers"`：（绑定 value 字段名 + "Modifiers"）

父组件

```html
<HelloWorld v-model:title.capitalize="inputValue" />
```

子组件

```html
<input type="text" :value="title" @input="handleCapitalize" />
```

```typescript
//prop
 props: {
    title: String,
    titleModifiers: { //使用title + Modifiers 获取修饰符对象 { capitalize:ture }
      type: Object,
      default: () => ({})
    }
  },
// mothods
handleCapitalize(event) {
  let value = event.target.value;
  if (this.titleModifiers.capitalize) { // capitalize:ture
    value = value.toLocaleUpperCase();
  }
  this.$emit("update:title", value);
}
```

> 如果`v-modle `使用默认值 `modelValue` 时，prop 修饰符对象使用 `modelModifiers` 作为属性名

## 单文件组件 style 中使用 script 中变量(实验性)

> `3.x` 单文件组件中 style 中可是使用当前`vue`实例的 data 数据
>
> 最新提议 https://github.com/vuejs/rfcs/pull/231

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red',						  // data中的变量在style中都可以使用 使用v-bind （11月10日最新提议）
      font: {								  // 之前的提议是 var(--变量名)
        size: '2em'
      }
    }
  }
</script>

<style>
.text {
  color: v-bind(color);
  /* 使用对象.属性 包在''引号中 */
  font-size: v-bind("font.size");
}
</style>
```

## 单文件组件样式作用域的变化

```vue
<style lang="scss" scoped>
/* deep (css选择器)  */
::v-deep(.foo) {}
/*可以在（）里写,  在sass less scss 等预编译器中可以写在 {} 中*/
::v-deep() {
    .foo{
        ...
    }
}
/* 简写 */
:deep(.foo) {}

/* 作用于插槽  给 slot 加对应 class="foo" 就可以作用到插槽上*/
::v-slotted(.foo) {}
/* 简写 */
:slotted(.foo) {}

/* 在 scoped 中作用全局的样式 功能就 跟不加scoped一样 感觉有点脱裤子放屁的感觉 */
::v-global(.foo) {}
/* 简写 */
:global(.foo) {}
</style>
```

## tip 名词含义

- `SFC` - 单文件组件

# demo ( Vue3 + TypeScript )

> 直接使用 vue-cil 初始化 vue3 项目

### Home.vue

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld v-model:title.capitalize="inputValue">
      <p class="default-solt">这里是默认插槽</p>
    </HelloWorld>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue"; // 使用defineComponent创建vue实例
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
  },
  created() {
    console.log("created");
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  setup() {
    console.log("setup 在 created 之前");
    const inputValue = ref("");
    return {
      inputValue,
    };
  },
});
</script>
<style lang="scss" scoped>
// 等价于下面
:deep(.skill) {
  color: skyblue;
}
:deep() {
  .skill {
    color: skyblue;
  }
}
// 等价于不加 scoped
:global(.modal) {
  & > div {
    color: skyblue !important;
  }
}
</style>
```

### HelloWorld.vue

```vue
<template>
  <div class="hello">
    <div>
      <!-- 展示数据 -->
      <div>鼠标x轴:{{ x }}</div>
      <div>鼠标y轴:{{ y }}</div>
      <span>{{ count }}</span>
      <span>双倍：{{ doubelCount }}</span>
      <button @click="count++">Increment count</button>
      <p>
        <input type="text" :value="title" @input="handleCapitalize" />
      </p>
      <p class="person">
        <span>姓名：{{ person.name }}</span>
        <span>年龄：{{ person.age }}</span>
      </p>
      <p class="skill">技能：敲代码</p>

      <!-- 打开dialog按钮 -->
      <button @click="modalOpen = true">
        Open full screen modal! (With teleport!)
      </button>
      <!-- dialog -->
      <teleport to="body">
        <div v-show="modalOpen" class="modal">
          <div>
            I'm a teleported modal! (My parent is "body")
            <button @click="modalOpen = false">Close</button>
          </div>
        </div>
      </teleport>
    </div>
    <!-- 默认插槽 -->
    <slot class="default-solt"></slot>
  </div>
</template>

<script lang="ts">
import { setup } from "@/components/setup"; // 直接导入 setup
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  emits: ["update:title"], // 显式的定义使用了哪些emits
  props: {
    title: String, // v-model绑定值
    titleModifiers: {
      // v-model绑定值对应的修饰符对象
      type: Object,
      default: () => ({}),
    },
  },
  setup,
});
</script>

<style scoped lang="scss">
// 使用script中的变量 color
.person {
  color: v-bind(color);
}
// 默认插槽加样式：无效
.default-solt {
  color: slateblue !important;
}
// 默认插槽加样式：有效
:slotted(.default-solt) {
  color: slateblue !important;
}

// dialog的样式
.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.modal div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 300px;
  height: 300px;
  padding: 5px;
}
</style>
```

### setup.ts

```typescript
import {
  ref, // 用于简单数据类型  需要.value 访问
  reactive, // 用于复杂数据类型 不需要.value 就直接可以方法
  toRefs, // 用于给prop添加响应数据，需要.value 访问
  watch,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
export const setup = (props: any, context: any) => {
  console.log("Bowen: setup -> props, context", props, context);
  //============================================================================
  // prop
  const { titleModifiers } = toRefs(props);
  //============================================================================
  // data
  const x = ref(0);
  const y = ref(0);
  const modalOpen = ref(false);
  const count = ref(0);
  const color = ref("red");
  const person = reactive({
    name: "Bowen",
    age: 18,
  });
  //============================================================================
  // computed
  const doubelCount = computed(() => count.value * 2);
  //============================================================================
  // watch
  watch(count, (val) => {
    console.log("Bowen: setup -> val", val);
  });
  //============================================================================
  // methods
  // 判断 v-model 是否有 capitalize 标识符  转换大写
  const handleCapitalize = (event: InputEvent) => {
    let value = (event.target as HTMLInputElement).value;
    if (titleModifiers.value.capitalize) {
      value = value.toLocaleUpperCase();
    }
    context.emit("update:title", value);
  };
  // 获取鼠标定位
  const getMousePosition = (e: MouseEvent) => {
    x.value = e.pageX;
    y.value = e.pageY;
  };
  //============================================================================
  // 生命周期
  onMounted(() => {
    document.addEventListener("mousemove", getMousePosition);
  });
  onUnmounted(() => {
    document.removeEventListener("mousemove", getMousePosition);
  });
  return {
    x,
    y,
    modalOpen,
    count,
    color,
    person,
    doubelCount,
    handleCapitalize,
  };
};
export default setup;
```

# vue3 组件库

## element-puls

elementUI 官方 bata 版 https://github.com/element-plus/element-plus
