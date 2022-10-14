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
    showGithubStars: true,
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
            <meta charset='UTF-8'>
            <title>{{title}}</title>
          </head>
          <body>
            <div id='container' />
            <script src='https://gw.alipayobjects.com/os/lib/antv/g2/${version}/dist/g2.min.js'></script>
            <script src='https://gw.alipayobjects.com/os/antv/pkg/_antv.data-set-0.11.1/dist/data-set.js'></script>
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
    /** 首页技术栈介绍 */
    detail: {
      title: 'G2 可视化引擎',
      description: 'G2 一套面向常规统计图表，以数据驱动的高交互可视化图形语法，具有高度的易用性和扩展性。使用 G2，你可以无需关注图表各种繁琐的实现细节，一条语句即可使用 Canvas 或 SVG 构建出各种各样的可交互的统计图表。',
      image: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*wo_LToatmbwAAAAAAAAAAABkARQnAQ',
      buttons: [
        {
          text: '图表示例',
          link: `/examples/gallery`,
          type: 'primary',
        },
        {
          text: '开始使用',
          link: `/tutorials/getting-started`,
        },
      ],
    },
    /** 新闻公告，优先选择配置的，如果没有配置则使用远程的！ */
    news: [
      {
        type: '论坛',
        title: 'AntV 芒种日 图新物：GraphInsight 发布',
        date: '2022.06.06',
        link: 'https://github.com/antvis/GraphInsight',
      },
      {
        type: '论坛',
        title: 'SEE Conf 2022 支付宝体验科技大会',
        date: '2022.01.08',
        link: 'https://seeconf.antfin.com/',
      },
    ],
    /** 首页特性介绍 */
    features: [
      {
        icon: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*4x_KTKyqwJgAAAAAAAAAAABkARQnAQ',
        title: '千变万化，自由组合',
        description: '任何图表，都可以基于图形语法灵活绘制，满足你无限的创意',
      },
      {
        icon: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ELYbTIVCgPoAAAAAAAAAAABkARQnAQ',
        title: '专业完备',
        description: '大量产品实践之上，提供绘图引擎、完备图形语法、专业设计规范',
      },
      {
        icon: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*_riSQZrgczgAAAAAAAAAAABkARQnAQ',
        title: '生动，可交互',
        description: '强大的交互语法，助力可视分析，让图表栩栩如生',
      },
    ],
    /** 首页案例 */
    cases: [
      {
        logo: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*-dLnTIexOxwAAAAAAAAAAABkARQnAQ',
        title: '精品 Gallery',
        description: '真实的数据可视化案例，我们将它们归纳为一个个故事性的设计模板，让用户达到开箱即用的效果。',
        link: `/examples/gallery`,
        image: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*hDrgRb7ma4EAAAAAAAAAAABkARQnAQ'
      },
    ],
    /** 首页合作公司 */
    companies: [
      { name: '阿里云', img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*V_xMRIvw2iwAAAAAAAAAAABkARQnAQ' },
      { name: '支付宝', img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*lYDrRZvcvD4AAAAAAAAAAABkARQnAQ', },
      { name: '天猫', img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*BQrxRK6oemMAAAAAAAAAAABkARQnAQ', },
      { name: '淘宝网', img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*1l8-TqUr7UcAAAAAAAAAAABkARQnAQ', },
      { name: '网上银行', img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ZAKFQJ5Bz4MAAAAAAAAAAABkARQnAQ', },
      { name: '京东', img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*yh-HRr3hCpgAAAAAAAAAAABkARQnAQ', },
      { name: 'yunos', img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*_js7SaNosUwAAAAAAAAAAABkARQnAQ', },
      { name: '菜鸟', img: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*TgV-RZDODJIAAAAAAAAAAABkARQnAQ', },
    ],
  },
  mfsu: false,
  links: [
  ],
  scripts: [
  ],
}
