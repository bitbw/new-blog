// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Bitbw",
  tagline: "Welcome to my blog!",
  url: "https://blog.bitbw.top",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "bitbw", // Usually your GitHub org/user name.
  projectName: "d-blog", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans", "en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/bitbw/new-blog/tree/preview",
        },
        blog: {
          blogTitle: "blog!",
          blogDescription: "Welcome to my blog!",
          blogSidebarTitle: "All blog",
          blogSidebarCount: "ALL",
          showReadingTime: true,
          truncateMarker: /<!--\s*(more)\s*-->/,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          readingTime: ({ content, frontMatter, defaultReadingTime }) =>
            defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
          editUrl:
            "https://github.com/bitbw/new-blog/tree/preview",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // keywords
      metadata: [
        {
          name: "keywords",
          content:
            "vue,js,javaScript,ts,typeScript,HTML,css,Sass,less,webpack,git,hexo,Node.js,算法,前端,小程序,技术个人博客",
        },
      ],
      navbar: {
        title: "Bitbw",
        logo: {
          alt: "Bitbw Logo",
          src: "img/logo.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Archive",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            type: "localeDropdown",
            position: "right",
          },
          {
            href: "https://github.com/bitbw",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Archive",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/bitbw",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/bitbw",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Bitbw, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      // algolia: {
      //   // Algolia 提供的应用 ID
      //   appId: "2A5CE9GGYC",
      //   //  公开 API 密钥：提交它没有危险
      //   apiKey: "959018e1a98022250b4c8ea26e372cf6",
      //   indexName: "test_index",
      // },
    }),
};

module.exports = config;
