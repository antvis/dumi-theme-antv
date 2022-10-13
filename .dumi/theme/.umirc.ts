export default {
  themeConfig: {
    title: 'AntV',
    description: 'Thinking in data visualization.',
    siteUrl: 'https://antv.vision',
    githubUrl: 'https://github.com/antvis',
    versions: {
    },
    showChartResize: true, // 是否在 demo 页展示图表视图切换
    showAPIDoc: true, // 是否在 demo 页展示API文档
    themeSwitcher: '',
    navs: [
      {
        slug: 'docs/tutorials',
        title: {
          zh: '教程',
          en: 'Tutorials',
        },
        order: 1,
      },
    ],
    tutorials: [
      {
        slug: 'tutorials/about',
        title: {
          zh: '关于',
          en: 'About',
        },
        order: 1,
      },
    ],
    examples: [
      {
        slug: 'gallery',
        icon: 'gallery',
        title: {
          zh: '',
          en: '',
        },
      },
    ],
    ecosystems: [
    ],
    docsearchOptions: {
      apiKey: 'key',
      indexName: 'antv',
    },
    playground: {
      devDependencies: {
        typescript: 'latest',
      },
      htmlCodeTemplate: ``,
    },
    announcement: {
      zh: '',
      en: '',
    },
  },
  mfsu: false,
  links: ["http://gw.alipayobjects.com/os/lib/antd/4.23.5/dist/antd.css"],
  scripts: [
    "https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.development.js",
    "https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.development.js",
    "https://gw.alipayobjects.com/os/lib/antd/4.23.5/dist/antd-with-locales.js",
    /** lodash */
    "https://gw.alipayobjects.com/os/lib/lodash/4.17.20/lodash.min.js",
  ],
}
