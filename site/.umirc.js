const isProduction = process.env.NODE_ENV === "production";

export default {
  title: "AntV SubProduct",
  mode: "site",
  base: "/",
  publicPath: "/",
  logo: "https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png",
  favicon: "https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png",
  // sitemap: {
  //   hostname: 'graphin.antv.vision',
  // },
  resolve: {
    includes: ["docs"],
  },

  extraBabelPlugins: [
    [
      "import",
      {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true,
      },
    ],
  ],
  metas: [
    {
      name: "keywords",
      content: "graphin,g6,graph,Graphin,AntV Graph",
    },
  ],

  navs: [
    null,
    {
      title: "v1.6.4",
      path: "https://antv.vision/graphin-1.x-site/",
    },
  ],

  analytics: isProduction ? { ga: "" } : false,
  hash: true,
  ssr: {
    devServerRender: false,
  },
  exportStatic: {},
  externals: {
    react: "window.React",
    "react-dom": "window.ReactDOM",
    antd: "window.antd",
    "@antv/g6": "window.G6",
  },
  targets: {
    chrome: 80,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
  theme: {
    "@s-site-menu-width": "280px",
    "@primary-color": "#873bf4",
  },
  locales: [
    ["zh-CN", "中文"],
    ["en-US", "English"],
  ],
  links: ["https://gw.alipayobjects.com/os/lib/antd/4.6.6/dist/antd.css"],
  scripts: [
    "https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.development.js",
    "https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.development.js",
    "https://gw.alipayobjects.com/os/lib/antd/4.6.6/dist/antd-with-locales.js",
    /** lodash */
    "https://gw.alipayobjects.com/os/lib/lodash/4.17.20/lodash.min.js",
  ],
};
