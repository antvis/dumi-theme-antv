import { repository, version } from './package.json';

export default {
  themeConfig: {
    title: 'G2',
    description: 'The Grammar of Graphics in JavaScript',
    siteUrl: 'https://g2.antv.vision',
    githubUrl: repository.url,
    versions: {
      [version]: 'https://g2.antv.vision/',
      '3.x': 'https://g2-v3.antv.vision/',
      '2.x': 'https://antv.vision/old-site/g2/doc/index.html',
    },
    showChartResize: true, // 是否在 demo 页展示图表视图切换
    showAPIDoc: true, // 是否在 demo 页展示API文档
    themeSwitcher: 'g2',
    navs: [
      {
        slug: 'docs/tutorials',
        title: {
          zh: '教程',
          en: 'Tutorials',
        },
        order: 2,
      },
      {
        slug: 'docs/api',
        title: {
          zh: 'API',
          en: 'API',
        },
        order: 1,
      },
      {
        slug: 'examples',
        title: {
          zh: '图表示例',
          en: 'Examples',
        },
        order: 0,
      },
    ],
    tutorials: [
      {
        slug: 'tutorials/about',
        title: {
          zh: '关于 G2',
          en: 'About G2',
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
      {
        slug: 'case',
        icon: 'gallery',
        title: {
          zh: '场景案例',
          en: 'Show Case',
        },
      },
    ],
    ecosystems: [
      {
        name: {
          zh: 'G2Plot（开箱即用的图表库）',
          en: 'G2Plot (A charting library)',
        },
        url: 'https://g2plot.antv.vision',
      }
    ],
    docsearchOptions: {
      apiKey: '200ec461f4aa0bb4f0e761566f1a1336',
      indexName: 'antv_g2',
    },
    playground: {
      devDependencies: {
        typescript: 'latest',
      },
      htmlCodeTemplate: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>{{title}}</title>
          </head>
          <body>
            <div id="container" />
            <script src="https://gw.alipayobjects.com/os/lib/antv/g2/${version}/dist/g2.min.js"></script>
            <script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.data-set-0.11.1/dist/data-set.js"></script>
            <script>
            <!-- 浏览器引入，请使用全局命名空间 G2，如 new Chart() 改为 new G2.Chart，即可运行。 -->
            {{code}}
            </script>
          </body>
        </html>`,
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
