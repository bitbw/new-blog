---
title: elementUI常见问题汇总
tags:
  - elementUI
  - Vue
categories: Vue
date: 2020-09-16 11:17:23
cnblogs:
  postid: "15392419"
hash: 8fb94c5a4775f43be95464188e34678ce73f2d1ca771884cf22e7d3bd3ab565b
---

> 这篇文章是我在工作中使用 elementUi 遇到的问题做的简单汇总，希望能对看到这篇文章的你有所帮助

## el-table

### 如何修改 el-table 展开树的三角图标

只需要给定 before 的 content 即可

```css
 // 隐藏展开箭头
  .el-table__expand-icon {
    // 修改展开箭头的样式
    .el-icon-arrow-right::before {
      content: "\e791";
      font-size: 18px;
    }
  }
}
```

参考网址：<https://blog.csdn.net/m0_37378152/article/details/102628860>

### elementUI 的 table 的每一项的 min-width 不要使用百分比

> elementUI 的 table 的每一项的 min-width 不要使用百分比 ,不然会出现这种情况

![image-20200227163411930](https://bitbw.top/public/img/my_gallery/image-20200227163411930.png)

> 固定的序号和 checkbox 会掉下来

### 修改 el-table 表头高度的坑

> el-table 固定列的 table，在 dom 上是有两个 thead 的所以要修改表头高度就一定要两个都修改 ，不然会导致固定列表头高度与正常表头高度不一致现象 ，在薪酬项目的代码示例

```scss
//处理表头高度
.el-table__header-wrapper th .cell .edit-table-header > p > span,
.el-table__fixed-header-wrapper th .cell .edit-table-header > p > span {
  padding: 5px 0;
}
```

### 在 dialog 中使用 table 的问题

> 在 dialog 中使用 table 发现无论怎样设置表头都会出现表头高度不正常现象 和数据不正常现象
>
> 这时可以使用 dialog 的 destroy-on-close 属性 （关闭时销毁 Dialog 中的元素）

### el-table 自定义动态表头：更新数据之后表头不更新

在开发中 表头但是多级表头并且是动态遍历的 ，遍历的数据发生改变表头数据却没有更新

#### 问题出现原因

```html
<el-table-column v-for="item in columnData" :key="item.id">
  <!--一级表头文字-->
  <template slot="header" slot-scope="scope">
    <div class="table-head">{{item.name }}</div>
  </template>
  <!--.........战略性省略业务代码.........-->
</el-table-column>
```

排查了很久，后发现：在自定义表头的时候，由于是用的 v-for 循环生成的，因此会给每个循环体一个固定的 key，导致数据频繁更新时，因为这个 key 没有变，所以 el-table 觉得表头数据是没有变化的，因此就只更新了整体表格数据、key 值有变化的列的表头。

```html
<!--表头的v-for中的key 使用 id + index 组合的形式使key变成动态的-->
<el-table-column v-for="(item,index) in tableData" :key="item.id + index">
  .....
</el-table-column>
```

## el-form

### elementUI 的 form 表单数据 resetFields 重置方法注意事项

`this.$refs.form["resetFields"]();`

form 无法重置表单项的原因有以下四点：

1. el-form-item 的 prop 属性缺失或属性值 不等于 字段名称
2. 表单项本身就有默认值
3. 表单数据绑定时未使用$nextTick 函数（resetFields 重置到挂载前的数据）
4. 未显示的表单项无法重置

### form 的坑 element ui form 表单只有一个输入框获取焦点的时候回车会触发表单的 submit 事件，导致页面刷新

**解决方法：**

> 当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 标签上添加 @submit.native.prevent。

## tree

### elementUI 的 tree 的 loadData()从新加载节点方法使用

```js
// 更新节点数据
this.currentNode.loaded = false; //需要配合node.loaded = false 使用
this.currentNode.loadData();
```

### elementUI tree 未展开的子节点数据改变却不更新的 bug

不采用懒加载方式直接改变 tree 的 data 数据发现为展开的子节点数据改变，展开后展示的数据却未变，

查看文档发现有个属性`render-after-expand`是否在第一次展开某个树节点后才渲染其子节点,

设置为`false`就可以解决了

### element 的 tree 的懒加载使用方法

#### load 属性

懒加载子树数据的方法，需要配合 lazy 属性为 true 时生效，点开当前节点时就会触发； 类型：function(node, resolve)

**node：**

- id: 26
- text: null
- checked: false
- indeterminate: false
- data: Object 当前绑定的 data
- expanded: true
- parent: Node 父节点
- visible: true
- isCurrent: false
- store: TreeStore
- level: 4 当前在第几级
- loaded: true
- childNodes: Array(5) 子节点
- loading: false
- isLeaf: false
- label: "中非莱基" 绑定显示的文字
- key: undefined
- disabled: ""
- nextSibling: Node
- previousSibling: Node

**resolve:**接收子节点的 data 自动绑定到树上

#### props 属性

定义 data 中的绑定项的 key

| 参数     | 说明                                                     | 类型                          | 可选值 | 默认值 |
| :------- | :------------------------------------------------------- | :---------------------------- | :----- | :----- |
| label    | 指定节点标签为节点对象的某个属性值                       | string, function(data, node)  | —      | —      |
| children | 指定子树为节点对象的某个属性值                           | string                        | —      | —      |
| disabled | 指定节点选择框是否禁用为节点对象的某个属性值             | boolean, function(data, node) | —      | —      |
| isLeaf   | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | boolean, function(data, node) | —      | —      |

## el-input

### el-input 同过正则限制只能输入正数可以带小数点 但不生效问题

代码：

```js
<el-input
    type="text"
    v-model.number="editingFormData.salary"
    oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"
></el-input>
```

> 正则一直不好 无法输入小数点 ， 是因为加了 number 修饰符无法输入小数点， 找了我一个多小时啊

![正则不生效原因](https://bitbw.top/public/img/my_gallery/正则不生效原因.jpg)

### 工作中出现的---表头带 input 搜索框 搜索后点击表格会刷新数据 bug

> 表格带表头 input 搜索的结构 搜索需要回车， 发现每次搜索回车后 点击表格或其他地方， 表格会刷新一下，经同事指点打开 Network 发现 ，点击其他地方会发次请求，打开 table 组件的源码发现 被别的同事添加了@blur 失去焦点事件，并且与回车事件调用同一个函数，因为回车不会使 input 框失去焦点，点击表格其他地方时 input 失去焦点导致再次触发搜索，所有好像自己刷新了一下的样子。 下面是表格内 input 的代码

```html
<el-input
  v-if="[undefined, '', 'input', 'button', 'string'].includes(field.fieldType)"
  v-bind="field.headerSearchAttrs"
  v-model.trim="field.inputValue"
  clearable
  :placeholder="field.label"
  @keyup.enter.native="handleBlur(field.prop, field.inputValue)"
  @blur="handleBlur(field.prop, field.inputValue)"
  @clear="clearQueryInput"
/>
<!-- @keyup.enter 和@blur调用同一函数产生的bug -->
```

##

## el-image

### elementUI 的 image 的 src 加载 vue 系统或本地图片的方法（重要）

> 正常情况以下情形是不生效的， 会提示找不到图片 所以需要用到，原生的 require 方法

```vue
<div class="message-item" v-for="(item, index) in uploadMessage" :key="index">
    <span class="item-txt">{{item.txt}}</span>
    <el-image :src="item.img" :preview-src-list="srcList"></el-image>
</div>
```

```js
//js部分
uploadMessage = [
  {
    txt: "1.进入税务系统",
    img: "@/hrwa/assets/taxset-information-management/taxset1.png",
  },
  {
    txt: "1.进入税务系统",
    img: "@/hrwa/assets/taxset-information-management/taxset2.png",
  },
  {
    txt: "1.进入税务系统",
    img: "@/hrwa/assets/taxset-information-management/taxset3.png",
  },
  {
    txt: "1.进入税务系统",
    img: "@/hrwa/assets/taxset-information-management/taxset4.png",
  },
]; //提示
```

> 图片会显示加载失败 ， 修改后 的代码结构 如下

```js
uploadMessage = [
  {
    txt: "1.进入税务系统",
    img: require("@/hrwa/assets/taxset-information-management/taxset1.png"),
  },
  {
    txt: "1.进入税务系统",
    img: require("@/hrwa/assets/taxset-information-management/taxset2.png"),
  },
  {
    txt: "1.进入税务系统",
    img: require("@/hrwa/assets/taxset-information-management/taxset3.png"),
  },
  {
    txt: "1.进入税务系统",
    img: require("@/hrwa/assets/taxset-information-management/taxset4.png"),
  },
];
//大图地址也需要加require
srcList = [
  require("@/hrwa/assets/taxset-information-management/taxset1.png"),
  require("@/hrwa/assets/taxset-information-management/taxset2.png"),
  require("@/hrwa/assets/taxset-information-management/taxset3.png"),
  require("@/hrwa/assets/taxset-information-management/taxset4.png"),
];
```

## 样式问题

- table 通过 th display: table-cell !important; 控制在谷歌浏览器下边框不对齐问题
- 导航菜单选中项样式问题通过类名.is-active 设置
- 顶部 logo 部分的顶部栏的高度，和子项宽度 都是通过 flex 属性设置，flex ：0 0 220px
- elementui 的样式变量在 E:\project\hr-web-container\node_modules\element-ui\packages\theme-chalk\src\common\var.scss 内

## date-picker

### 问题 datepicker 星期日期选择组件。绑定值格式化为时间戳时会出现乱码

[github issues](https://github.com/ElemeFE/element/issues/21159)

将datepicker组件的type属性设置为week，value-format属性设置为timestamp，此时无法回显选择的日期，通过打印v-model值可以得知此时的v-model正确值是乱码 `ti0e0tam0p`

### 解决

目前 github 上没有解决 elementUI 2 已经没有维护了 ， value-format尽量别设置为timestamp 就可以避免这个问题
