---
title: Next.js入门
date: 2022-08-10T16:56:34.000Z
tags:
  - Next
categories: Next
hash: 7b04328c182b2f3db7329a6667c8095db5fdeb06e85886fed6528ad369fb2ed7
cnblogs:
  postid: '17041107'
---

## Next 特点

next 适合用于公司官网、文章类、电商类等对于 SEO 需求高的网站。
中后台管理系统无需 SEO 所以也不一定需要使用 Next

## 创建 Next.js 应用

```sh
npx create-next-app nextjs-blog --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"

cd nextjs-blog

npm run dev
```

## 路由

Next 中路由就是对应的文件路径

例如，在开发中：

pages/index.js与/路线相关联。
pages/posts/first-post.js与/posts/first-post路线相关联。

### Link

`<Link>` 用于在页面中导航

```jsx
import Link from 'next/link';
<h1 className="title">
  Read <Link href="/posts/first-post">this page!</Link>
</h1>
```

>在 Next.js 的生产版本中，每当Link组件出现在浏览器的视口中时，Next.js 都会在后台自动预取链接页面的代码。当您单击链接时，目标页面的代码已经在后台加载，页面转换几乎是即时的！

## 资源 css 等

### 静态文件服务

Next 可以以 `public` 为基础,在根目录中的一个文件夹下提供静态文件服务，从基本 `baseURL`/ 开始引用 `public` 其中的文件
例如：public/me.png 对应 `http://localhost:3000/me.png`
这点跟 `vue-cli` 和 `rca` 类似

### css

Next 支持 [CSS Modules](https://nextjs.org/docs/basic-features/built-in-css-support#adding-component-level-css)

>重要提示：要使用CSS 模块，CSS 文件名必须以.module.css

#### 使用 Sass

```sh
npm install -D sass
```

### 图片

```jsx
import Image from 'next/image';

const YourComponent = () => (
  <Image
    src="/images/profile.jpg" // Route of the image file
    height={144} // Desired size with correct aspect ratio
    width={144} // Desired size with correct aspect ratio
    alt="Your Name"
  />
);
```

### head

```jsx
import Head from 'next/head';
// 直接会渲染到 head 标签中
<Head>
  <title>Create Next App</title>
  <link rel="icon" href="/favicon.ico" />
</Head>
```

## 全局样式

要加载全局 CSS文件，请创建一个名为的文件pages/_app.js，其内容如下

```jsx
// `pages/_app.js`
import '../styles/global.css';
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

该App组件是所有不同页面通用的顶级组件。例如，您可以使用此App组件在页面之间导航时保​​持状态

### 添加 layout 组件

[layout 组件](https://nextjs.org/learn/basics/assets-metadata-css/polishing-layout)

。

## 预渲染

### 两种形式的预渲染

Next.js 有两种预渲染形式：静态生成和服务器端渲染。不同之处在于它何时为页面生成 HTML

- 静态生成是在构建时生成 HTML 的预渲染方法。然后在每个请求上重用预呈现的 HTML
- 服务器端渲染是在每个请求上生成 HTML 的预渲染方法。

### 静态生成

#### getStaticProps

getStaticProps 仅在服务器端运行

开发与生产

- 在开发（npm run dev或yarn dev）中，getStaticProps在每个请求上运行。
- 在生产中，getStaticProps 在构建时运行。但是，可以使用返回的fallback键来增强此行为 getStaticPaths

我们建议尽可能使用静态生成（有数据和无数据），因为您的页面可以构建一次并由 CDN 提供服务，这比让服务器在每次请求时呈现页面要快得多。

您可以将静态生成用于多种类型的页面，包括：

- 营销页面
- 博客文章
- 电子商务产品列表
- 帮助和文档

```jsx
// 服务端
export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
// 客户端
export default function Home({ allPostsData }) {
  const [state, setState] = useState(false);
  return (
    <Layout home>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

```

**注意事项**

- 因为它仅在构建时运行，所以您将无法使用仅在请求期间可用的数据，例如查询参数或 HTTP 标头。
- 仅允许在页面中, getStaticProps只能从页面导出。您不能从非页面文件中导出它。这种限制的原因之一是 React 需要在呈现页面之前拥有所有必需的数据
- 因为它仅在构建时运行 所以无法获取实时数据（仅适用于类似 静态博客 这种案例）

### 服务器端渲染

如果您需要在请求时而不是在构建时获取数据，您可以尝试服务器端渲染：

getServerSideProps

```js
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    },
  };
}

```

与 SEO 无关的私人、用户特定页面使用服务器端渲染

### 预渲染 总结

优先使用`静态生成` 实在不能使用`静态生成`的地方再使用`服务器端渲染`或`客户端渲染`

#### 静态生成原理

每个文件对应一个页面,每个页面构建时都会先执行一下 `getStaticProps`,将 `props`传递给页面组件,然后根据页面组件生成对应的`html`, 浏览器直接请求对应的`html`会包含样式，所以即使禁用`javascript`还是可以正常浏览

## 动态路由

动态路由同静态生成类似,需要有静态数据用于生成对应的路由和页面

我们希望每个帖子都有 `path/posts/id`
首先，我们将在pages/posts创建一个名为`[id].js`的页面。 注意是`[id]`需要带 `[]`

### getStaticPaths

`[id].js` 文件导出 `getStaticPaths` 函数

[id].js

```jsx

export default function Post({ postData }) {
  return (
    <Layout>
      {/* Add this <Head> tag */}
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          {postData.date}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
/* 
paths 是所有 id 的集合 （所有 [host]/posts/* 的集合, ps:告诉 next 构建时需要生成哪些页面和路由）
paths [
  { params: { id: 'pre-rendering' } },
  { params: { id: 'ssg-ssr' } },
  { params: { id: 'vue原理' } }
] 
params 中的参数和文件名 [id].js 需要对应  [id].js => params.id
*/
export async function getStaticPaths() {
  // Return a list of possible value for id
  // Returns an array that looks like this:
  // { params: { id: 'pre-rendering' } },
  // { params: { id: 'ssg-ssr' } },
  let paths = getAllPostIds();
  return {
    paths,
    fallback: true, // 如果fallback是false，则任何无法匹配的路径getStaticPaths都将导致404 页面。 true 则会报错
  };
}

// 这里返回的 props 将传递给  Post 组件
// 构建时 next 直接根据 postData 生成对应页面
export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  // postData : { contentHtml date  title}
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}


```

### getStaticPaths 中的  fallback 参数

如果fallback是

- false，则任何无法匹配的路径getStaticPaths都将导致404 页面。
- true 则会报错
- 如果fallback是blocking，那么新路径将在服务器端呈现getStaticProps，并缓存以供将来的请求使用，因此每个路径仅发生一次。

### 多重路径动态路由

...通过在括号内添加三个点 ( ) 可以扩展动态路由以捕获所有路径例如：

- pages/posts/[...id].js匹配/posts/a, 但也/posts/a/b,/posts/a/b/c等等。
如果你这样做， in getStaticPaths，你必须返回一个数组作为id键的值，如下所示：

```js
return [
  {
    params: {
      // Statically Generates /posts/a/b/c
      id: ['a', 'b', 'c'],
    },
  },
  //...
];
```

并且params.id将是一个数组getStaticProps:

```jsx
export async function getStaticProps({ params }) {
  // params.id will be like ['a', 'b', 'c']
}

```

### router

如果你想访问 Next.js 路由器，你可以通过useRouter从next/router.

### 404页

要创建自定义 404 页面，请创建pages/404.js. 该文件是在构建时静态生成的

## API 接口

使用 Next 创建 api 接口,跟创建页面类似，可以使用文件路由的形式 `pages/api` 下创建对应的接口文件

在  `pages/api` 下 创建 `hello.js`

```js
export default function handler(req, res) {
  res.status(200).json({ text: 'Hello' });
}

```

尝试在<http://localhost:3000/api/hello>访问它。你应该看到{"text":"Hello"}。

### 文章接口实现（利用 next API）

#### 创建文件

- `pages/api/post/index.js`  -> <http://localhost:3000/api/post> // 获取所有文章数据
- `pages/api/post/[postId].js`  -> <http://localhost:3000/api/post/postId> // 获取单个文章数据
- `pages/api/post/ids.js`  -> <http://localhost:3000/api/post/ids> // 获取所有文章的id

`pages/api/post/index.js`

```js
// 查询全部
import { getSortedPostsData } from "../../../lib/posts";

export default function handler(req, res) {
  let PostsDatas = getSortedPostsData();
  res.status(200).json(PostsDatas);
}
```

`pages/api/post/[postId].js`

```js
import { getPostData } from "../../../lib/posts";

// 查询单个
export default async function handler(req, res) {
  const { postId } = req.query;
  try {
    let data = await getPostData(postId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "failed to load data" });
  }
}
```

`pages/api/post/ids.js`

```js
// id list
import { getAllPostIds } from "../../../lib/posts";

export default function handler(req, res) {
  let data = getAllPostIds();
  res.status(200).json(data);
}

```

### 官方文档

[动态 API 路由](https://nextjs.org/docs/api-routes/dynamic-api-routes)
[请求助手](https://nextjs.org/docs/api-routes/request-helpers)
[响应助手](https://nextjs.org/docs/api-routes/response-helpers)

## 部署到 Vercel

[官方教程](https://nextjs.org/learn/basics/deploying-nextjs-app/deploy)

### Vercel

Next.js 和 Vercel
Vercel由 Next.js 的创建者制作，并为 Next.js 提供一流的支持。当您将 Next.js 应用程序部署到Vercel时，默认情况下会发生以下情况：

使用静态生成和资产（JS、CSS、图像、字体等）的页面将自动从速度极快的Vercel 边缘网络提供服务。
使用Server-Side Rendering和API 路由的页面将自动成为孤立的Serverless Functions。这允许页面呈现和 API 请求无限扩展

### 流程

- 源代码上传 github
- 注册 Vercel
- [导入github项目](https ://vercel.com/import/git)(导入时会提示安装Vercel)

添加后vercel根据分支自动部署（相当于预配置好的git action）

### 预览

- 创建预览分支
- 修改并上传预览分支
- 回到 github 仓库 会看到提示添加 Pull requests 根据提示添加 Pull requests
- 进到新创建的 Pull requests 中可以查看预览分支 部署好的页面
![Pull requests](https://s2.loli.net/2023/01/15/w4gZXHt8c2isbzD.png)
- 预览分支没问题就可以合并到主分支了

### 自定义域名

[自定义域名](https://vercel.com/docs/concepts/projects/custom-domains#dns-records)

- 进入项目setting
- 选择域菜单项
- 添加域名随便写个域名会提示正确的域名填写方式
- 添加域名 （同时添加域名解析  CNAME cname.vercel-dns.com）
- 添加预览域名 （同时添加域名解析 CNAME cname.vercel-dns.com）

## 环境变量

### 环境变量加载顺序

环境变量按顺序在以下位置查找，一旦找到变量就停止。

- process.env
- .env.$(NODE_ENV).local
- .env.local（未检查何时 NODE_ENV 是 test。）
- .env.$(NODE_ENV)
- .env
例如，如果NODE_ENVis并且您在 and development中都定义了一个变量，则将使用in 中的值 `.env.development.local` `.env` .env.development.local

注意：NODE_ENV允许的值为 production,development 和 test。
