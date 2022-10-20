import type { IApi } from 'dumi';

function generateMetaJSON() {
  return {
    'site': {
      'siteMetadata': {
        'title': 'G2',
        'galleryMenuCloseAll': false,
        'examples': [
          {
            'slug': 'gallery',
            'icon': 'gallery',
            'title': {
              'zh': '',
              'en': '',
            },
          },
          {
            'slug': 'case',
            'icon': 'gallery',
            'title': {
              'zh': '场景案例',
              'en': 'Show Case',
            },
          },
          {
            'slug': 'interaction',
            'icon': 'interaction',
            'title': {
              'zh': '交互语法',
              'en': 'Grammar of Interaction',
            },
          },
          {
            'slug': 'line',
            'icon': 'line',
            'title': {
              'zh': '折线图',
              'en': 'Line Chart',
            },
          },
          {
            'slug': 'area',
            'icon': 'area',
            'title': {
              'zh': '面积图',
              'en': 'Area Chart',
            },
          },
          {
            'slug': 'column',
            'icon': 'column',
            'title': {
              'zh': '柱状图',
              'en': 'Column Chart',
            },
          },
          {
            'slug': 'bar',
            'icon': 'bar',
            'title': {
              'zh': '条形图',
              'en': 'Bar Chart',
            },
          },
          {
            'slug': 'pie',
            'icon': 'pie',
            'title': {
              'zh': '饼图',
              'en': 'Pie Chart',
            },
          },
          {
            'slug': 'point',
            'icon': 'point',
            'title': {
              'zh': '点图',
              'en': 'Point Chart',
            },
          },
          {
            'slug': 'radar',
            'icon': 'radar',
            'title': {
              'zh': '雷达图',
              'en': 'Radar Chart',
            },
          },
          {
            'slug': 'funnel',
            'icon': 'funnel',
            'title': {
              'zh': '漏斗图',
              'en': 'Funnel Chart',
            },
          },
          {
            'slug': 'heatmap',
            'icon': 'heatmap',
            'title': {
              'zh': '热力图',
              'en': 'Heatmap',
            },
          },
          {
            'slug': 'box',
            'icon': 'box',
            'title': {
              'zh': '箱型图',
              'en': 'Box Chart',
            },
          },
          {
            'slug': 'candlestick',
            'icon': 'candlestick',
            'title': {
              'zh': '烛形图',
              'en': 'Candlestick Chart',
            },
          },
          {
            'slug': 'gauge',
            'icon': 'gauge',
            'title': {
              'zh': '仪表盘',
              'en': 'Gauges',
            },
          },
          {
            'slug': 'map',
            'icon': 'map',
            'title': {
              'zh': '地图',
              'en': 'Maps',
            },
          },
          {
            'slug': 'facet',
            'icon': 'facet',
            'title': {
              'zh': '分面',
              'en': 'Facets',
            },
          },
          {
            'slug': 'relation',
            'icon': 'relation',
            'title': {
              'zh': '关系图',
              'en': 'Relation Chart',
            },
          },
          {
            'slug': 'component',
            'icon': 'component',
            'title': {
              'zh': '组件使用',
              'en': 'Chart Components',
            },
          },
          {
            'slug': 'other',
            'icon': 'other',
            'title': {
              'zh': '其他图表',
              'en': 'Other Chart',
            },
          },
          {
            'slug': 'customize',
            'icon': 'other',
            'title': {
              'zh': '业务自定义',
              'en': 'Customize',
            },
          },
        ],
        'playground': {
          'container': null,
          'playgroundDidMount': null,
          'playgroundWillUnmount': null,
          'dependencies': null,
          'devDependencies': {
            'typescript': 'latest',
          },
          'htmlCodeTemplate': '<!DOCTYPE html>\n        <html>\n          <head>\n            <meta charset="UTF-8">\n            <title>{{title}}</title>\n          </head>\n          <body>\n            <div id="container" />\n            <script src="https://gw.alipayobjects.com/os/lib/antv/g2/4.2.7/dist/g2.min.js"></script>\n            <script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.data-set-0.11.1/dist/data-set.js"></script>\n            <script>\n            <!-- 浏览器引入，请使用全局命名空间 G2，如 new Chart() 改为 new G2.Chart，即可运行。 -->\n            {{code}}\n            </script>\n          </body>\n        </html>',
        },
      },
      'pathPrefix': '',
    },
    'allMarkdownRemark': {
      'edges': [
        {
          'node': {
            'fields': {
              'slug': '/en/examples/gallery',
            },
            'frontmatter': {
              'title': 'Gallery',
              'order': -1,
              'icon': 'other',
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'gallery/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/gallery',
            },
            'frontmatter': {
              'title': '所有图表',
              'order': -1,
              'icon': 'other',
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'gallery/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/relation/relation',
            },
            'frontmatter': {
              'title': '关系图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'relation/relation/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/relation/relation',
            },
            'frontmatter': {
              'title': 'Graph',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'relation/relation/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/radar/radar',
            },
            'frontmatter': {
              'title': 'Radar Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'radar/radar/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/radar/radar',
            },
            'frontmatter': {
              'title': '雷达图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'radar/radar/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/point/scatter',
            },
            'frontmatter': {
              'title': 'Scatter Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/scatter/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/point/scatter',
            },
            'frontmatter': {
              'title': '散点图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/scatter/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/pie/basic',
            },
            'frontmatter': {
              'title': 'Basic Pie Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/basic/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/pie/basic',
            },
            'frontmatter': {
              'title': '基础饼图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/basic/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/other/other',
            },
            'frontmatter': {
              'title': 'Others',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'other/other/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/other/other',
            },
            'frontmatter': {
              'title': '其他图表',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'other/other/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/other/big-data',
            },
            'frontmatter': {
              'title': '大数据量',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'other/big-data/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/other/big-data',
            },
            'frontmatter': {
              'title': 'Big data',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'other/big-data/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/line/basic',
            },
            'frontmatter': {
              'title': '基础折线图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/basic/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/interaction/element',
            },
            'frontmatter': {
              'title': 'Element',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/element/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/line/basic',
            },
            'frontmatter': {
              'title': 'Basic Line Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/basic/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/interaction/element',
            },
            'frontmatter': {
              'title': '图形元素',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/element/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/heatmap/basic',
            },
            'frontmatter': {
              'title': 'Color Block Heatmap',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/basic/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/gauge/gauge',
            },
            'frontmatter': {
              'title': '仪表盘',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'gauge/gauge/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/gauge/gauge',
            },
            'frontmatter': {
              'title': 'Gauge',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'gauge/gauge/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/funnel/funnel',
            },
            'frontmatter': {
              'title': 'Funnel Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'funnel/funnel/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/facet/facet',
            },
            'frontmatter': {
              'title': '分面分类',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'facet/facet/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/facet/facet',
            },
            'frontmatter': {
              'title': 'Facet Category',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'facet/facet/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/customize/component',
            },
            'frontmatter': {
              'title': '自定义组件',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'customize/component/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/customize/component',
            },
            'frontmatter': {
              'title': 'Customize',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'customize/component/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/funnel/funnel',
            },
            'frontmatter': {
              'title': '漏斗图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'funnel/funnel/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/heatmap/basic',
            },
            'frontmatter': {
              'title': '色块图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/basic/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/component/annotation',
            },
            'frontmatter': {
              'title': 'Annotation',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/annotation/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/component/annotation',
            },
            'frontmatter': {
              'title': 'Annotation',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/annotation/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/basic',
            },
            'frontmatter': {
              'title': 'Basic Column Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/basic/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/basic',
            },
            'frontmatter': {
              'title': '基础柱状图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/basic/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/line',
            },
            'frontmatter': {
              'title': 'Line Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/line/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/line',
            },
            'frontmatter': {
              'title': '折线图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/line/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/candlestick/candlestick',
            },
            'frontmatter': {
              'title': 'K Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'candlestick/candlestick/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/box/box',
            },
            'frontmatter': {
              'title': 'Box Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'box/box/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/box/box',
            },
            'frontmatter': {
              'title': '箱型图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'box/box/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/candlestick/candlestick',
            },
            'frontmatter': {
              'title': '烛形图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'candlestick/candlestick/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/bar/basic',
            },
            'frontmatter': {
              'title': 'Basic Bar Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/basic/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/bar/basic',
            },
            'frontmatter': {
              'title': '基础条形图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/basic/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/area/basic',
            },
            'frontmatter': {
              'title': 'Basic Area Chart',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/basic/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/area/basic',
            },
            'frontmatter': {
              'title': '基础面积图',
              'order': 0,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/basic/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/point/bubble',
            },
            'frontmatter': {
              'title': 'Bubble Chart',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/bubble/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/point/bubble',
            },
            'frontmatter': {
              'title': '气泡图',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/bubble/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/pie/donut',
            },
            'frontmatter': {
              'title': 'Donut Chart',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/donut/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/line/step',
            },
            'frontmatter': {
              'title': 'Step Line Chart',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/step/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/pie/donut',
            },
            'frontmatter': {
              'title': '环图',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/donut/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/interaction/component',
            },
            'frontmatter': {
              'title': '图表组件',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/component/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/interaction/component',
            },
            'frontmatter': {
              'title': 'Components',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/component/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/heatmap/calendar',
            },
            'frontmatter': {
              'title': 'Calendar Heatmap',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/calendar/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/heatmap/calendar',
            },
            'frontmatter': {
              'title': '日历热力图',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/calendar/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/component/label',
            },
            'frontmatter': {
              'title': 'Label',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/label/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/component/label',
            },
            'frontmatter': {
              'title': 'Label',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/label/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/dodge',
            },
            'frontmatter': {
              'title': 'Grouped Column Chart',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/dodge/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/dodge',
            },
            'frontmatter': {
              'title': '分组柱状图',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/dodge/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/column',
            },
            'frontmatter': {
              'title': 'Column Chart',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/column/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/column',
            },
            'frontmatter': {
              'title': '柱状图',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/column/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/bar/dodge',
            },
            'frontmatter': {
              'title': '分组条形图',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/dodge/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/bar/dodge',
            },
            'frontmatter': {
              'title': 'Grouped Bar Chart',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/dodge/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/area/stacked',
            },
            'frontmatter': {
              'title': 'Stacked Area Chart',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/stacked/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/area/stacked',
            },
            'frontmatter': {
              'title': '堆叠面积图',
              'order': 1,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/stacked/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/point/jitter',
            },
            'frontmatter': {
              'title': '扰动点图',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/jitter/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/point/jitter',
            },
            'frontmatter': {
              'title': 'Jitter Point Chart',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/jitter/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/pie/rose',
            },
            'frontmatter': {
              'title': '南丁格尔玫瑰图',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/rose/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/pie/rose',
            },
            'frontmatter': {
              'title': 'Nightingale Rose Chart',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/rose/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/line/step',
            },
            'frontmatter': {
              'title': '阶梯折线图',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/step/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/line/path',
            },
            'frontmatter': {
              'title': '路径图',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/path/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/line/path',
            },
            'frontmatter': {
              'title': 'Path Chart',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/path/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/interaction/brush',
            },
            'frontmatter': {
              'title': '框选',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/brush/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/heatmap/heatmap',
            },
            'frontmatter': {
              'title': 'Heatmap',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/heatmap/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/interaction/brush',
            },
            'frontmatter': {
              'title': 'Brush',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/brush/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/heatmap/heatmap',
            },
            'frontmatter': {
              'title': '热力图',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/heatmap/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/component/tooltip',
            },
            'frontmatter': {
              'title': 'Tooltip',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/tooltip/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/component/tooltip',
            },
            'frontmatter': {
              'title': 'Tooltip',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/tooltip/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/stack',
            },
            'frontmatter': {
              'title': 'Stacked Column Chart',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/stack/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/stack',
            },
            'frontmatter': {
              'title': '堆叠柱状图',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/stack/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/bar',
            },
            'frontmatter': {
              'title': 'Bar Chart',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/bar/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/bar',
            },
            'frontmatter': {
              'title': '条形图',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/bar/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/bar/stack',
            },
            'frontmatter': {
              'title': 'Stacked Bar Chart',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/stack/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/bar/stack',
            },
            'frontmatter': {
              'title': '堆叠条形图',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/stack/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/area/range',
            },
            'frontmatter': {
              'title': '区间面积图',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/range/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/area/range',
            },
            'frontmatter': {
              'title': 'Range Area Chart',
              'order': 2,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/range/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/pie/nested',
            },
            'frontmatter': {
              'title': 'Nested Pie Chart',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/nested/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/pie/nested',
            },
            'frontmatter': {
              'title': '嵌套饼图',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/nested/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/line/multiple',
            },
            'frontmatter': {
              'title': 'Kernel Smooth Regression Line Chart',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/multiple/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/line/multiple',
            },
            'frontmatter': {
              'title': '核函数概率密度回归曲线',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/multiple/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/interaction/others',
            },
            'frontmatter': {
              'title': 'Others',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/others/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/interaction/others',
            },
            'frontmatter': {
              'title': '其他',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/others/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/dodge-stack',
            },
            'frontmatter': {
              'title': 'Grouped-stacked Column Chart',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/dodge-stack/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/dodge-stack',
            },
            'frontmatter': {
              'title': '分组层叠柱状图',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/dodge-stack/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/pie',
            },
            'frontmatter': {
              'title': 'Pie Chart',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/pie/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/pie',
            },
            'frontmatter': {
              'title': '饼图',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/pie/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/area/streamgraph',
            },
            'frontmatter': {
              'title': '河流图',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/streamgraph/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/area/streamgraph',
            },
            'frontmatter': {
              'title': 'Streamgraph',
              'order': 3,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/streamgraph/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/component/legend',
            },
            'frontmatter': {
              'title': '图例',
              'order': 4,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/legend/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/component/legend',
            },
            'frontmatter': {
              'title': 'Legend',
              'order': 4,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/legend/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/histogram',
            },
            'frontmatter': {
              'title': '直方图',
              'order': 4,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/histogram/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/histogram',
            },
            'frontmatter': {
              'title': 'Histogram',
              'order': 4,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/histogram/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/area',
            },
            'frontmatter': {
              'title': 'Area Chart',
              'order': 4,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/area/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/area',
            },
            'frontmatter': {
              'title': '面积图',
              'order': 4,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/area/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/facet',
            },
            'frontmatter': {
              'title': 'Facet',
              'order': 6,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/facet/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/facet',
            },
            'frontmatter': {
              'title': '分面',
              'order': 6,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/facet/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/dynamic',
            },
            'frontmatter': {
              'title': 'Dynamic Charts',
              'order': 7,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/dynamic/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/dynamic',
            },
            'frontmatter': {
              'title': '动态图表',
              'order': 7,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/dynamic/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/sankey',
            },
            'frontmatter': {
              'title': 'Sankey',
              'order': 8,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/sankey/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/sankey',
            },
            'frontmatter': {
              'title': '桑基图',
              'order': 8,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/sankey/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/interactions',
            },
            'frontmatter': {
              'title': 'Custom interactions',
              'order': 8,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/interactions/index.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/interactions',
            },
            'frontmatter': {
              'title': '自定义交互',
              'order': 8,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/interactions/index.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/radar/radar/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'radar/radar/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/relation/relation/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'relation/relation/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/radar/radar/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'radar/radar/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/point/scatter/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/scatter/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/point/scatter/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/scatter/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/point/jitter/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/jitter/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/relation/relation/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'relation/relation/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/point/bubble/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/bubble/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/pie/rose/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/rose/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/pie/rose/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/rose/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/pie/nested/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/nested/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/pie/nested/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/nested/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/point/bubble/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/bubble/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/pie/donut/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/donut/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/pie/donut/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/donut/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/pie/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/basic/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/point/jitter/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'point/jitter/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/pie/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'pie/basic/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/other/other/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'other/other/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/other/other/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'other/other/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/other/big-data/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'other/big-data/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/other/big-data/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'other/big-data/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/line/step/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/step/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/line/step/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/step/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/line/path/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/path/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/line/multiple/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/multiple/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/line/multiple/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/multiple/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/line/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/basic/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/line/path/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/path/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/line/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'line/basic/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/interaction/others/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/others/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/interaction/component/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/component/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/interaction/component/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/component/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/interaction/element/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/element/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/heatmap/heatmap/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/heatmap/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/interaction/others/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/others/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/interaction/element/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/element/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/heatmap/heatmap/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/heatmap/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/heatmap/calendar/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/calendar/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/interaction/brush/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/brush/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/interaction/brush/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'interaction/brush/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/heatmap/calendar/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/calendar/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/heatmap/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/basic/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/gauge/gauge/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'gauge/gauge/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/gauge/gauge/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'gauge/gauge/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/heatmap/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'heatmap/basic/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/funnel/funnel/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'funnel/funnel/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/funnel/funnel/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'funnel/funnel/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/facet/facet/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'facet/facet/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/customize/component/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'customize/component/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/facet/facet/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'facet/facet/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/customize/component/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'customize/component/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/component/tooltip/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/tooltip/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/component/tooltip/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/tooltip/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/component/legend/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/legend/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/component/legend/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/legend/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/component/label/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/label/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/component/label/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/label/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/component/annotation/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/annotation/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/stack/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/stack/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/stack/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/stack/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/component/annotation/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'component/annotation/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/dodge-stack/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/dodge-stack/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/dodge-stack/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/dodge-stack/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/histogram/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/histogram/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/histogram/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/histogram/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/dodge/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/dodge/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/basic/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/column/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/basic/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/sankey/design',
            },
            'frontmatter': {
              'title': 'Design Guide',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/sankey/design.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/sankey/design',
            },
            'frontmatter': {
              'title': '设计指引',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/sankey/design.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/pie/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/pie/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/pie/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/pie/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/line/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/line/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/line/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/line/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/column/dodge/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'column/dodge/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/facet/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/facet/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/facet/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/facet/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/dynamic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/dynamic/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/dynamic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/dynamic/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/column/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/column/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/bar/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/bar/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/bar/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/bar/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/column/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/column/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/case/area/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/area/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/candlestick/candlestick/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'candlestick/candlestick/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/candlestick/candlestick/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'candlestick/candlestick/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/box/box/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'box/box/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/box/box/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'box/box/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/bar/dodge/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/dodge/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/bar/dodge/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/dodge/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/bar/stack/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/stack/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/bar/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/basic/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/case/area/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'case/area/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/area/streamgraph/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/streamgraph/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/bar/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/basic/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/bar/stack/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'bar/stack/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/area/stacked/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/stacked/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/area/streamgraph/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/streamgraph/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/area/range/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/range/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/area/stacked/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/stacked/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/en/examples/area/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/basic/API.en.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/area/basic/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/basic/API.zh.md',
            },
          },
        },
        {
          'node': {
            'fields': {
              'slug': '/zh/examples/area/range/API',
            },
            'frontmatter': {
              'title': '',
              'order': null,
              'icon': null,
            },
            'parent': {
              '__typename': 'File',
              'relativePath': 'area/range/API.zh.md',
            },
          },
        },
      ],
    },
  };
}

export default (api: IApi) => {
  const pages = [
    {
      id: 'theme-antv-page-example',
      path: '/:language/examples/*',
      file: require.resolve('./.dumi/theme/pages/Examples.tsx'),
    },
  ];
  // FIXME: wrap winPath for windows when dumi exported
  const contextFilePath = require.resolve('./.dumi/theme/context.ts');

  api.onGenerateFiles(() => {
    // write context provider when generate tmp file
    api.writeTmpFile({
      noPluginDir: true,
      path: 'theme-antv/ContextWrapper.tsx',
      content: `
import { useOutlet } from 'dumi';
import { ThemeAntVContext } from '${contextFilePath}';

export default function ThemeAntVContextWrapper() {
  const outlet = useOutlet();

  return (
    <ThemeAntVContext.Provider
      value={{
        meta: ${JSON.stringify(generateMetaJSON())}
      }}
    >
      {outlet}
    </ThemeAntVContext.Provider>
  );
}
      `,
    });
  });

  // wrap context for all pages
  api.addLayouts(() => ({
    id: 'theme-antv-context',
    file: `${api.paths.absTmpPath}/theme-antv/ContextWrapper.tsx`,
  }));

  // add custom pages
  api.modifyRoutes((routes) => {
    pages.forEach((page) => {
      routes[page.id] = {
        id: page.id,
        path: page.path,
        absPath: page.path,
        file: page.file,
        parentId: 'DocLayout',
      };
    });

    // replace default 404
    routes['404'].file = require.resolve('./.dumi/theme/pages/404.tsx');

    return routes;
  });
};
