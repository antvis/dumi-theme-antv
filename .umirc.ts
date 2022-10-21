import { repository, version } from './package.json';

export default {
  themeConfig: {
    title: 'dumi-theme-antv',
    description: '基于 dumi2 的 AntV 官网主题包',
    defaultLanguage: 'zh',                                              // 默认语言
    isAntVSite: false,                                                  // 是否是 AntV 的大官网
    siteUrl: 'https://antv.vision',                                     // 官网地址
    githubUrl: repository.url,                                          // GitHub 地址
    showSearch: true,                                                   // 是否显示搜索框
    showGithubCorner: true,                                             // 是否显示头部的 GitHub icon
    showGithubStars: true,                                              // 是否显示 GitHub star 数量
    showAntVProductsCard: true,                                         // 是否显示 AntV 产品汇总的卡片
    showLanguageSwitcher: true,                                         // 是否显示官网语言切换
    showWxQrcode: true,                                                 // 是否显示头部菜单的微信公众号
    showChartResize: true,                                              // 是否在 demo 页展示图表视图切换
    showAPIDoc: true,                                                   // 是否在 demo 页展示API文档
    themeSwitcher: 'g2',
    versions: {                                                         // 历史版本以及切换下拉菜单
      [version]: 'https://antv.vision/',
      '0.2.x': 'https://antv.vision/',
    },
    navs: [                                                             // 头部的菜单列表
      {
        slug: 'manual',
        title: {
          zh: '教程',
          en: 'Tutorials',
        },
        order: 2,
      },
      {
        slug: 'api',
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
    ecosystems: [                                                       // 头部的菜单中的「周边生态」
      {
        name: {
          zh: 'G2 官网',
          en: 'G2 website',
        },
        url: 'https://g2.antv.vision',
      },
      {
        name: {
          zh: 'G6 官网',
          en: 'G6 website',
        },
        url: 'https://g6.antv.vision',
      }
    ],
    tutorials: [
      {
        slug: 'manual/about',
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
          zh: '技术栈官网',
          en: 'Sites',
        },
      },
    ],
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
      title: 'dumi-theme-antv 主题包',
      description: '基于 dumi2 封装，提供灵活多变的 slots 插槽，抽取大量配置，一秒搭建 AntV 的各个技术栈官网。',
      image: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*wo_LToatmbwAAAAAAAAAAABkARQnAQ',
      buttons: [
        {
          text: '开始使用',
          link: `/tutorials/getting-started`,
        },
        {
          text: '迁移手册',
          link: `/tutorials/migration`,
          type: 'primary',
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
