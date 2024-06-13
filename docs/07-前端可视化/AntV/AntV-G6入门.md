---
title: AntV/G6入门
date: 2022-03-07T16:47:17.000Z
tags:
  - AntV
categories: 前端可视化
hash: fb8170ad171a0ca51c89a36da116ae79bc47d63515345854e9b74ab641da0c99
cnblogs:
  postid: '15992788'
---


[官方教程](https://g6.antv.vision/zh/docs/manual/tutorial/preface)

## 安装

```bash
    npm install --save @antv/g6
```

> 使用 vue 作为模板

## 步骤

```vue
<template>
  <v-container>
    <!--步骤.1 容器 -->
    <div id="mountNode"></div>
  </v-container>
</template>

<script>
import G6 from "@antv/g6";
export default {
  name: "G6",
  async mounted() {
    /*
    ## 步骤.2 数据准备
    引入 G6 的数据源为 JSON 格式的对象。该对象中需要有节点（nodes）和边（edges）字段，分别用数组表示：
     */

    // 初始化数据
    const initData = {
      // 点集
      nodes: [
        {
          id: "node1", // 节点的唯一标识
          x: 100, // 节点横坐标
          y: 200, // 节点纵坐标
          label: "起始点", // 节点文本
        },
        {
          id: "node2",
          x: 300,
          y: 200,
          label: "目标点",
        },
      ],
      // 边集
      edges: [
        // 表示一条从 node1 节点连接到 node2 节点的边
        {
          source: "node1", // 起始点 id
          target: "node2", // 目标点 id
          label: "我是连线", // 边的文本
        },
      ],
    };
    /*
    ## 步骤.3 图实例化
    图实例化时，至少需要为图设置容器、宽、高：
     */
    const graph = new G6.Graph({
      container: "mountNode", // 指定挂载容器
      width: 800, // 图的宽度
      height: 500, // 图的高度
    });
    /*
    ## 步骤.4 图的渲染
    数据的加载和图的渲染是两个步骤，可以分开进行。
     */

    graph.data(initData); // 加载数据

    graph.render(); // 渲染 调用 graph.render() 方法之后，G6 引擎会根据加载的数据进行图的绘制。
  },
};
</script>

```
<!-- more -->
## 元素及其配置

```vue
<script>
export default {
  name: "G6",
  async mounted() {
    const response = await fetch(
      "https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json"
    );
    const initData = await response.json();
    // 将请求返回的数据遍历 设置每个节点的样式
    const nodes = initData.nodes;
    nodes.forEach((node) => {
      if (!node.style) {
        node.style = {};
      }
      switch (
        node.class // 根据节点数据中的 class 属性配置图形
      ) {
        case "c0": {
          node.type = "circle"; // class = 'c0' 时节点图形为 circle
          break;
        }
        case "c1": {
          node.type = "rect"; // class = 'c1' 时节点图形为 rect
          node.size = [35, 20]; // class = 'c1' 时节点大小
          break;
        }
        case "c2": {
          node.type = "ellipse"; // class = 'c2' 时节点图形为 ellipse
          node.size = [35, 20]; // class = 'c2' 时节点大小
          break;
        }
      }
    });
    // 遍历边数据  设置每个边的样式
    const edges = initData.edges;
    edges.forEach((edge) => {
      if (!edge.style) {
        // 边的样式会覆盖全局样式 所以需要把全局样式挪到这里
        edge.style = {
          stroke: "grey", // 边描边颜色
          opacity: 0.6, // 边透明度
        };
      }
      edge.style.lineWidth = edge.weight; // 边的粗细映射边数据中的 weight 属性数值
    });
    // 初始化数据
    // const initData = {
    //   // 点集 （节点集合）
    //   nodes: [
    //     /*
    //     元素的属性
    //     不论是节点还是边，它们的属性分为两种：

    //     样式属性 style：对应 Canvas 中的各种样式，在元素状态 State 发生变化时，可以被改变；
    //     其他属性：例如图形类型（ type）、id（id ）一类在元素状态 State 发生变化时不能被改变的属性。
    //     例如，G6 设定 hover 或 click 节点，造成节点状态的改变，只能自动改变节点的样式属性（如 fill、stroke 等），其他属性（如 type  等）不能被改变。如果需要改变其他属性，要通过  graph.updateItem 手动配置。样式属性是一个名为  style  的对象， style 字段与其他属性并行。
    //      */
    //     // 以节点元素为例，其属性的数据结构如下：
    //     {
    //       id: "node0", // 元素的 id
    //       x: 0, // 节点横坐标
    //       y: 0, // 节点纵坐标
    //       type: "rect", // 元素的图形
    //       size: 40, // 元素的大小
    //       label: "node0", // 标签文字
    //       visible: true, // 控制初次渲染显示与隐藏，若为 false，代表隐藏。默认不隐藏
    //       // 标签配置属性
    //       labelCfg: {
    //         positions: "left", // 标签的属性，标签在元素中的位置
    //         // 包裹标签样式属性的字段 style 与标签其他属性在数据结构上并行
    //         style: {
    //           fontSize: 12, // 标签的样式属性，文字字体大小
    //           // ...            // 标签的其他样式属性
    //         },
    //       },
    //       // ...,               // 其他属性
    //       // 包裹样式属性的字段 style 与其他属性在数据结构上并行
    //       style: {
    //         fill: "#000", // 样式属性，元素的填充色
    //         stroke: "#888", // 样式属性，元素的描边色
    //         // ...              // 其他样式属性
    //       },
    //     },
    //     {
    //       id: "node1", // 节点的唯一标识
    //       x: 100, // 节点横坐标
    //       y: 200, // 节点纵坐标
    //       label: "起始点", // 节点文本
    //     },
    //     {
    //       id: "node2",
    //       x: 300,
    //       y: 200,
    //       label: "目标点",
    //     },
    //   ],
    //   // 边集
    //   edges: [
    //     /*
    //     边元素的属性数据结构与节点元素相似，只是其他属性中多了 source 和 target 字段，代表起始和终止节点的 id。
    //      */
    //     // 表示一条从 node0 节点连接到 node1 节点的边
    //     {
    //       source: "node0", // 起始点 id
    //       target: "node1", // 目标点 id
    //       label: "我是连线", // 边的文本
    //     },
    //     // 表示一条从 node1 节点连接到 node2 节点的边
    //     {
    //       source: "node1", // 起始点 id
    //       target: "node2", // 目标点 id
    //       label: "我是连线", // 边的文本
    //     },
    //   ],
    // };
    const graph = new G6.Graph({
      fitView: true, // 设置是否将图适配到画布中
      fitViewPadding: [0, 0, 0, 10], // 画布上四周的留白宽度。
      animate: true, // 是否启用图的动画。
      // 图上行为模式的集合。由于比较复杂，按需参见：G6 中的 Mode 教程。
      modes: {
        default: [
          // 拖拽节点
          "drag-node",
          // 拖拽整个画布
          "drag-canvas",
        ],
      },
      // 节点默认的属性，包括节点的一般属性和样式属性（style）
      defaultNode: {
        size: 30, // 节点大小
        /*
          type node节点图形类型
          G6 支持以下图形：
          - circle：圆；
          - rect：矩形；
          - ellipse：椭圆；
          - polygon：多边形；
          - image：图片；
          - marker：标记；
          - path：路径；
          - text：文本；
          - dom(svg)：DOM（图渲染方式 renderer 为 'svg' 时可用）。
         */
        // type: "circle",
        // color: "#ff00ff",
        // 节点样式配置 文档 https://g6.antv.vision/zh/docs/api/shapeProperties#%E9%80%9A%E7%94%A8%E5%B1%9E%E6%80%A7
        style: {
          //////////////////////////////////////////////////////////////////////
          //通用属性
          //////////////////////////////////////////////////////////////////////
          // 图形名称标识，G6 3.3 版本以上必须配置。
          name: "bitbw",
          // 设置用于填充绘画的颜色(RGB 或 16 进制)、渐变或模式，对应 Canvas 属性 fillStyle 。取值示例：rgb(18, 150, 231)，#c193af，l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff， r(0.5, 0.5, 0.1) 0:#ffffff 1:#1890ff。
          fill: "steelblue",
          // 节点描边色
          stroke: "#666",
          // 边宽度
          lineWidth: 6,
          // 描边虚线，Number[] 类型中数组元素分别代表实、虚长度。
          lineDash: [1, 1],
          // 设置用于阴影的颜色。
          shadowColor: "#000000",
          // 设置用于阴影的模糊级别，数值越大，越模糊。 (扩散范围)
          shadowBlur: 20,
          // 设置阴影距形状的水平距离。(x 轴偏移量)
          shadowOffsetX: 10,
          // 设置阴影距形状的垂直距离。(Y 轴偏移量)
          shadowOffsetY: 10,
          // 设置绘图的当前 alpha 或透明值，范围 [0, 1]，对应 Canvas 属性 globalAlpha。
          opacity: 0.3,
          // 设置填充的 alpha 或透明值，优先级高于 opacity，范围 [0, 1]。
          fillOpacity: 0.9,
          // 设置描边的 alpha 或透明值，优先级高于 opacity，范围 [0, 1]。
          strokeOpacity: 0.9,
          // 鼠标在该节点上时的鼠标样式，CSS 的 cursor 选项都支持。
          cursor: "help",
          //////////////////////////////////////////////////////////////////////
          // 各个图形属性  见文档
          //////////////////////////////////////////////////////////////////////
        },
        // 节点上的标签文本配置
        labelCfg: {
          // 节点上的标签文本样式配置
          style: {
            fill: "#fff", // 节点标签文字颜色
          },
        },
      },
      // 边默认的属性，包括边的一般属性和样式属性（style）
      defaultEdge: {
        type: "polyline",
        color: "#ffff00",
        // ...                 // 边的其他配置
        // 边样式配置
        style: {
          opacity: 0.6, // 边透明度
          stroke: "grey", // 边描边颜色
        },
        // 边上的标签文本配置
        labelCfg: {
          autoRotate: true, // 边上的标签文本根据边的方向旋转
        },
      },
      // 边在除默认状态外，其他状态下的样式属性（style）。例如鼠标放置（hover）、选中（select）等状态
      nodeStateStyles: {
        hover: {},
        select: {},
      },
      container: "mountNode", // 指定挂载容器
      width: 1000, // 图的宽度
      height: 1000, // 图的高度
    });

    graph.data(initData); // 加载数据

    graph.render(); // 渲染 调用 graph.render() 方法之后，G6 引擎会根据加载的数据进行图的绘制。
  },
};
</script>
```

## 布局Layout

```vue
<script>
export default {
  name: "G6",
  async mounted() {
    /* 
    当数据中没有节点位置信息，或者数据中的位置信息不满足需求时，需要借助一些布局算法对图进行布局。G6 提供了 9 种一般图的布局和 4 种树图的布局：
    一般图：

    Random Layout：随机布局；
    Force Layout：经典力导向布局：

    力导向布局：一个布局网络中，粒子与粒子之间具有引力和斥力，从初始的随机无序的布局不断演变，逐渐趋于平衡稳定的布局方式称之为力导向布局。适用于描述事物间关系，比如人物关系、计算机网络关系等。

    Circular Layout：环形布局；
    Radial Layout：辐射状布局；
    MDS Layout：高维数据降维算法布局；
    Fruchterman Layout：Fruchterman 布局，一种力导布局；
    Dagre Layout：层次布局；
    Concentric Layout：同心圆布局，将重要（默认以度数为度量）的节点放置在布局中心；
    Grid Layout：格子布局，将节点有序（默认是数据顺序）排列在格子上。
    树图布局：

    Dendrogram Layout：树状布局（叶子节点布局对齐到同一层）；
    CompactBox Layout：紧凑树布局；
    Mindmap Layout：脑图布局；
    Indented Layout：缩进布局。
     */

    /* 
      配置布局
     */
    const graph = new G6.Graph({
      //////////////////////////////////////////////////////////////////////////
      // Object，可选，布局的方法及其配置项，默认为 random 布局。
      layout: {
        type: "force", // 指定为力导向布局
        preventOverlap: true, // 防止节点重叠
        linkDistance: 100, // 指定边距离为100
        // nodeSize: 30, // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
      },
      //////////////////////////////////////////////////////////////////////////
      animate: true, // 是否启用图的动画。
      // 图上行为模式的集合。由于比较复杂，按需参见：G6 中的 Mode 教程。
      modes: {
        default: [
          // 拖拽节点
          "drag-node",
          // 拖拽整个画布
          "drag-canvas",
        ],
      },
      defaultNode: {
        size: 30,
        labelCfg: {
          style: {
            fill: "#fff",
          },
        },
      },
      defaultEdge: {
        labelCfg: {
          autoRotate: true,
        },
      },
      container: "mountNode", // 指定挂载容器
      width: 1000, // 图的宽度
      height: 1000, // 图的高度
    });

    const main = async () => {
      const response = await fetch(
        "https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json"
      );
      const remoteData = await response.json();

      const nodes = remoteData.nodes;
      const edges = remoteData.edges;
      nodes.forEach((node) => {
        if (!node.style) {
          node.style = {};
        }
        node.style.lineWidth = 1;
        node.style.stroke = "#666";
        node.style.fill = "steelblue";
        switch (node.class) {
          case "c0": {
            node.type = "circle";
            break;
          }
          case "c1": {
            node.type = "rect";
            node.size = [35, 20];
            break;
          }
          case "c2": {
            node.type = "ellipse";
            node.size = [35, 20];
            break;
          }
        }
      });
      edges.forEach((edge) => {
        if (!edge.style) {
          edge.style = {};
        }
        edge.style.lineWidth = edge.weight;
        edge.style.opacity = 0.6;
        edge.style.stroke = "grey";
      });

      graph.data(remoteData);
      graph.render();
    };
    main();
  },
};
</script>
```

## 交互行为Behavior

```vue
<script>
export default {
  name: "G6",
  async mounted() {
    /* 
    交互行为 Behavior
    G6 中的交互行为。G6 内置了一系列交互行为，用户可以直接使用。简单地理解，就是可以一键开启这些交互行为：

    drag-canvas：拖拽画布；
    zoom-canvas：缩放画布。

    交互管理 Mode
    Mode 是 G6 交互行为的管理机制，一个 mode 是多种行为 Behavior 的组合，允许用户通过切换不同的模式进行交互行为的管理。由于该概念较为复杂，在本入门教程中，读者不需要对该机制深入理解。如有需求，参见 交互模式 Mode。

    交互状态 State
    状态 State 是 G6 中的状态机制。用户可以为图中的元素（节点/边）设置不同的状态及不同状态下的样式。在状态发生变化时，G6 自动更新元素的样式。例如，可以为节点设置状态 'click' 为 true 或 false，并为节点设置 'click' 的样式为加粗节点边框。当 'click' 状态被切换为 true 时，节点的边框将会被加粗，'click' 状态被切换为 false 时，节点的样式恢复到默认。在下面的使用方法中，将会有具体例子。
     */

    const graph = new G6.Graph({
      //////////////////////////////////////////////////////////////////////////
      //  交互管理 Mode
      //////////////////////////////////////////////////////////////////////////
      modes: {
        // 默认模式
        default: [
          // 拖拽节点
          "drag-node",
          // 拖拽整个画布
          "drag-canvas",
          // 放缩画布
          "zoom-canvas",
        ],
        // 编辑模式
        edit: [],
      },
      //////////////////////////////////////////////////////////////////////////
      // 交互状态 State
      //////////////////////////////////////////////////////////////////////////
      // 节点不同状态下的样式集合
      nodeStateStyles: {
        // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
        hover: {
          fill: "lightsteelblue",
        },
        // 鼠标点击节点，即 click 状态为 true 时的样式
        click: {
          stroke: "#000",
          lineWidth: 3,
        },
      },
      // 边不同状态下的样式集合
      edgeStateStyles: {
        // 鼠标点击边，即 click 状态为 true 时的样式
        click: {
          stroke: "steelblue",
        },
      },
      //////////////////////////////////////////////////////////////////////////

      // Object，可选，布局的方法及其配置项，默认为 random 布局。
      layout: {
        type: "force", // 指定为力导向布局
        preventOverlap: true, // 防止节点重叠
        linkDistance: 100, // 指定边距离为100
        // nodeSize: 30, // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
      },
      animate: true, // 是否启用图的动画。

      defaultNode: {
        size: 30,
        labelCfg: {
          style: {
            fill: "#fff",
          },
        },
      },
      defaultEdge: {
        labelCfg: {
          autoRotate: true,
        },
      },
      container: "mountNode", // 指定挂载容器
      width: 1000, // 图的宽度
      height: 1000, // 图的高度
    });
    /* 
    监听事件并切换元素状态
    G6 中所有元素监听都挂载在图实例上，如下代码中的 graph 对象是 G6.Graph 的实例，graph.on()  函数监听了某元素类型（node / edge）的某种事件（click / mouseenter / mouseleave / ... 所有事件参见：Event API）。
    // 在图实例 graph 上监听
    graph.on('元素类型:事件名', (e) => {
      // do something
    });
     */
    //////////////////////////////////////////////////////////////////////////
    // 监听事件并切换元素状态
    //////////////////////////////////////////////////////////////////////////
    // 鼠标进入节点
    graph.on("node:mouseenter", (e) => {
      const nodeItem = e.item; // 获取鼠标进入的节点元素对象
      graph.setItemState(nodeItem, "hover", true); // 设置当前节点的 hover 状态为 true
    });

    // 鼠标离开节点
    graph.on("node:mouseleave", (e) => {
      const nodeItem = e.item; // 获取鼠标离开的节点元素对象
      graph.setItemState(nodeItem, "hover", false); // 设置当前节点的 hover 状态为 false
    });

    // 点击节点
    graph.on("node:click", (e) => {
      // 先将所有当前是 click 状态的节点置为非 click 状态
      const clickNodes = graph.findAllByState("node", "click");
      console.log("Bowen: mounted -> clickNodes", clickNodes)
      clickNodes.forEach((cn) => {
        graph.setItemState(cn, "click", false);
      });
      const nodeItem = e.item; // 获取被点击的节点元素对象
      graph.setItemState(nodeItem, "click", true); // 设置当前节点的 click 状态为 true
    });

    // 点击边
    graph.on("edge:click", (e) => {
      // 先将所有当前是 click 状态的边置为非 click 状态
      const clickEdges = graph.findAllByState("edge", "click");
      clickEdges.forEach((ce) => {
        graph.setItemState(ce, "click", false);
      });
      const edgeItem = e.item; // 获取被点击的边元素对象
      graph.setItemState(edgeItem, "click", true); // 设置当前边的 click 状态为 true
    });

    const main = async () => {
      const response = await fetch(
        "https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json"
      );
      const remoteData = await response.json();

      const nodes = remoteData.nodes;
      const edges = remoteData.edges;
      nodes.forEach((node) => {
        if (!node.style) {
          node.style = {};
        }
        node.style.lineWidth = 1;
        node.style.stroke = "#666";
        node.style.fill = "steelblue";
        switch (node.class) {
          case "c0": {
            node.type = "circle";
            break;
          }
          case "c1": {
            node.type = "rect";
            node.size = [35, 20];
            break;
          }
          case "c2": {
            node.type = "ellipse";
            node.size = [35, 20];
            break;
          }
        }
      });
      edges.forEach((edge) => {
        if (!edge.style) {
          edge.style = {};
        }
        edge.style.lineWidth = edge.weight;
        edge.style.opacity = 0.6;
        edge.style.stroke = "grey";
      });

      graph.data(remoteData);
      graph.render();
    };
    main();
  },
};
</script>
```

## 插件与交互工具

```vue
<script>
import G6 from "@antv/g6";
export default {
  name: "G6",
  async mounted() {
    /* 
    插件与工具
    为辅助用户在图上探索，G6 提供了一些辅助工具，其中一部分是插件工具，另一部分是交互工具。

    本文将为 Tutorial 案例 添加缩略图插件、网格插件、节点提示框、边提示框。

    插件
    使用插件时，有三个步骤：
      Step 1: 引入插件；
      Step 2: 实例化插件；
      Step 3: 在实例化图时将插件的实例配置到图上
    
    交互工具
    交互工具是指配置到图上交互模式中的工具。使用交互工具时，有两个步骤：
      Step 1: 在实例化图时配置 modes；
      Step 2: 为交互工具定义样式。
     */
    ////////////////////////////////////////////////////////////////////////////
    // 插件
    ////////////////////////////////////////////////////////////////////////////
    //Minimap 缩略图 (Minimap) 是一种常见的用于快速预览和探索图的工具，可作为导航辅助用户探索大规模图。
    // 实例化 minimap 插件 （minimap 原理新建了一个 canvas 定位到主体画布上）
    const minimap = new G6.Minimap({
      size: [100, 200],
      className: "minimap",
      type: "delegate",
    });
    //Image Minimap 用于优化 minimap 性能  前期展示用于替代 minimap 的 image
    // 实例化 Image Minimap 插件
    // const imageMinimap = new G6.ImageMinimap({
    //   width: 200,
    //   // 用于在 minimap 位置显示的 image
    //   graphImg:
    //     "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*eD7nT6tmYgAAAAAAAAAAAABkARQnAQ",
    // });
    // 实例化 grid 插件 grid 原理新建了一个非常大的 div 背景图片为网格  定位到主体画布上 并设置 z-index -1 ）
    const grid = new G6.Grid();
    console.log("Bowen: mounted -> grid", grid);
    // 实例化图
    const graph = new G6.Graph({
      plugins: [minimap, grid], // 将 grid 实例配置到图上
      ////////////////////////////////////////////////////////////////////////////
      modes: {
        // 默认模式
        default: [
          // 拖拽节点
          "drag-node",
          // 拖拽整个画布
          "drag-canvas",
          // 放缩画布
          "zoom-canvas",
          ////////////////////////////////////////////////////////////////////////////
          // 交互工具
          ////////////////////////////////////////////////////////////////////////////
          {
            // 提示框 tooltip
            // 本质为一个 div 定位到画布上， formatText返回的内容为div中内容 同时需要给 .g6-tooltip 样式
            type: "tooltip",
            formatText(model) {
              // 提示框文本内容
              const text =
                "label: " + model.label + "<br/> class: " + model.class;
              return text;
            },
          },
        ],
        // 编辑模式
        edit: [],
      },
      // 节点不同状态下的样式集合
      nodeStateStyles: {
        // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
        hover: {
          fill: "lightsteelblue",
        },
        // 鼠标点击节点，即 click 状态为 true 时的样式
        click: {
          stroke: "#000",
          lineWidth: 3,
        },
      },
      // 边不同状态下的样式集合
      edgeStateStyles: {
        // 鼠标点击边，即 click 状态为 true 时的样式
        click: {
          stroke: "steelblue",
        },
      },
      // Object，可选，布局的方法及其配置项，默认为 random 布局。
      layout: {
        type: "force", // 指定为力导向布局
        preventOverlap: true, // 防止节点重叠
        linkDistance: 100, // 指定边距离为100
        // nodeSize: 30, // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
      },
      animate: true, // 是否启用图的动画。

      defaultNode: {
        size: 30,
        labelCfg: {
          style: {
            fill: "#fff",
          },
        },
      },
      defaultEdge: {
        labelCfg: {
          autoRotate: true,
        },
      },
      container: "mountNode", // 指定挂载容器
      width: 800, // 图的宽度
      height: 500, // 图的高度
    });
    // 鼠标进入节点
    graph.on("node:mouseenter", (e) => {
      const nodeItem = e.item; // 获取鼠标进入的节点元素对象
      graph.setItemState(nodeItem, "hover", true); // 设置当前节点的 hover 状态为 true
    });

    // 鼠标离开节点
    graph.on("node:mouseleave", (e) => {
      const nodeItem = e.item; // 获取鼠标离开的节点元素对象
      graph.setItemState(nodeItem, "hover", false); // 设置当前节点的 hover 状态为 false
    });

    // 点击节点
    graph.on("node:click", (e) => {
      // 先将所有当前是 click 状态的节点置为非 click 状态
      const clickNodes = graph.findAllByState("node", "click");
      console.log("Bowen: mounted -> clickNodes", clickNodes);
      clickNodes.forEach((cn) => {
        graph.setItemState(cn, "click", false);
      });
      const nodeItem = e.item; // 获取被点击的节点元素对象
      graph.setItemState(nodeItem, "click", true); // 设置当前节点的 click 状态为 true
    });

    // 点击边
    graph.on("edge:click", (e) => {
      // 先将所有当前是 click 状态的边置为非 click 状态
      const clickEdges = graph.findAllByState("edge", "click");
      clickEdges.forEach((ce) => {
        graph.setItemState(ce, "click", false);
      });
      const edgeItem = e.item; // 获取被点击的边元素对象
      graph.setItemState(edgeItem, "click", true); // 设置当前边的 click 状态为 true
    });

    const main = async () => {
      const response = await fetch(
        "https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json"
      );
      const remoteData = await response.json();

      const nodes = remoteData.nodes;
      const edges = remoteData.edges;
      nodes.forEach((node) => {
        if (!node.style) {
          node.style = {};
        }
        node.style.lineWidth = 1;
        node.style.stroke = "#666";
        node.style.fill = "steelblue";
        switch (node.class) {
          case "c0": {
            node.type = "circle";
            break;
          }
          case "c1": {
            node.type = "rect";
            node.size = [35, 20];
            break;
          }
          case "c2": {
            node.type = "ellipse";
            node.size = [35, 20];
            break;
          }
        }
      });
      edges.forEach((edge) => {
        if (!edge.style) {
          edge.style = {};
        }
        edge.style.lineWidth = edge.weight;
        edge.style.opacity = 0.6;
        edge.style.stroke = "grey";
      });

      graph.data(remoteData);
      graph.render();
    };
    main();
  },
};
</script>
<style lang="scss">
/* 提示框的样式 */
.g6-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}

// g6 主体位置
canvas {
  position: relative;
  z-index: 1;
}
// 网格位置
.g6-grid-container {
  z-index: 0 !important;
  *,
  ::before,
  ::after {
    // 覆盖 vuetify  background-repeat: no-repeat;
    background-repeat: repeat;
  }
}
</style>

```
