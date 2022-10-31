"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[2643],{86299:function(i,t,n){n.r(t),n.d(t,{default:function(){return r}});var e=n(62903),a=n(62594),o=n(54767);function r(){var l=(0,e.pC)();return(0,o.jsx)(a.w.Provider,{value:{meta:{exampleTopics:[{id:"case",title:{zh:"\u573A\u666F\u6848\u4F8B",en:"Show Case"},icon:"gallery",examples:[{demos:[{id:"area1",screenshot:"https://gw.alipayobjects.com/mdn/rms_f5c722/afts/img/A*QlLyQ6EleE4AAAAAAAAAAABkARQnAQ",source:`import { Chart } from '@antv/g2';

fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/fireworks-sales.json')
  .then(res => res.json())
  .then(data => {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500,
    });
    chart.data(data);
    chart.scale('Data', {
      range: [0, 1],
      tickCount: 10,
      type: 'timeCat'
    });
    chart.scale('sales', {
      nice: true,
    });
    chart.axis('sales', {
      label: {
        formatter: text => {
          return text.replace(/(\\d)(?=(?:\\d{3})+$)/g, '$1,');
        }
      }
    });
    chart.tooltip({
      showCrosshairs: true,
    });

    chart.annotation().dataMarker({
      position: ['2014-01', 1750],
      top: true,
      text: {
        content: '\u56E0\u653F\u7B56\u8C03\u6574\u5BFC\u81F4\u9500\u91CF\u4E0B\u6ED1',
        style: {
          fontSize: 13,
        }
      },
      line: {
        length: 30,
      },
    });

    chart.line().position('Data*sales');
    chart.area().position('Data*sales');
    chart.render();
  });
`,title:{zh:"\u67D0\u516C\u53F8\u70DF\u82B1\u56FD\u5185\u7D2F\u8BA1\u9500\u552E\u989D\u8D8B\u52BF",en:"Domestic cumulative sales trend of fireworks"},filename:"area1.ts",isNew:!0},{id:"area2",screenshot:"https://gw.alipayobjects.com/mdn/rms_f5c722/afts/img/A*KDGDQLKrV_EAAAAAAAAAAABkARQnAQ",source:`import { Chart } from '@antv/g2';

const data = [
  { month: '1', value: 1078 },
  { month: '2', value: 1216 },
  { month: '3', value: 758 },
  { month: '4', value: 623 },
  { month: '5', value: 319 },
  { month: '6', value: 422 },
  { month: '7', value: -4 },
  { month: '8', value: -217 },
  { month: '9', value: -358 },
  { month: '10', value: 1513 },
  { month: '11', value: 1388 },
  { month: '12', value: 597 }
];

const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 500,
});
chart.data(data);
chart.scale({
  value: {
    max: 2000,
    min: -1000
  },
  month: {
    formatter: val => \`\${val} \u6708\`
  }
});


chart.area().position('month*value').color('white').style({
  fillOpacity: 0.3,
});
chart.line().position('month*value').color('white');
// \u5206\u6BB5\u989C\u8272
chart.annotation().regionFilter({
  top: true,
  start: ['min', 'max'],
  end: ['max', 0],
  color: '#f5222d'
});

chart.annotation().regionFilter({
  top: true,
  start: ['min', 0],
  end: ['max', 'min'],
  color: '#2fc25b'
});
// \u6570\u636E\u6807\u6CE8
chart.annotation().dataMarker({
  position: ['2', 1216],
  text: {
    content: '2\u6708\u4EFD\u56E0\u9022\u6625\u8282\u6C34\u4EA7\u9500\u552E\u9700\u6C42\u65FA\u76DB\uFF0C\\n\u9700\u6C42\u5927\u589E',
    style: {
      textAlign: 'left',
    },
  },
  line: {
    length: 20,
  },
  point: {
    style: {
      fill: '#f5222d',
      stroke: '#f5222d',
    },
  },
  autoAdjust: false,
});

chart.annotation().dataMarker({
  position: ['10', 1513],
  text: {
    content: '\u5F00\u6E14\u540E\u4EA7\u54C1\u9500\u552E\u53CC\u589E\uFF0C\u5229\u6DA6\u8FBE\u5230\\n\u5168\u5E74\u65B0\u9AD8',
    style: {
      textAlign: 'right',
    },
  },
  line: {
    length: 20,
  },
  point: {
    style: {
      fill: '#f5222d',
      stroke: '#f5222d',
    }
  },
  autoAdjust: false,
  direction: 'downward'
});

chart.annotation().dataMarker({
  position: ['9', -358],
  text: {
    content: '\u56E0\u4F11\u6E14\u671F\u65E0\u65B0\u8FDB\u8D27\u6E90\uFF0C\u6210\u672C\u644A\u9500\\n\u4E0B\u6765\u6709\u4E8F\u635F',
    style: {
      textAlign: 'right',
      lineWidth: 2
    },
  },
  line: {
    length: 20,
  },
  point: {
    style: {
      fill: '#2fc25b',
      stroke: '#2fc25b',
    },
  },
  autoAdjust: false,
  direction: 'downward'
});
// \u8F85\u52A9\u533A\u95F4
chart.annotation().region({
  start: ['7', 'min'],
  end: ['9', 'max']
});

chart.render();
`,title:{zh:"\u67D0\u6C34\u4EA7\u516C\u53F8 2017 \u5E74\u6708\u76C8\u5229\u53D8\u5316",en:"Month earnings"},filename:"area2.ts",isNew:!1},{id:"area4",screenshot:"https://gw.alipayobjects.com/mdn/rms_f5c722/afts/img/A*borBSI58D7gAAAAAAAAAAABkARQnAQ",source:`import { Chart } from '@antv/g2';

fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/gas-import-export.json')
  .then(res => res.json())
  .then(data => {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500,
      padding: [50, 20, 30, 30]
    });
    chart.data(data);
    chart.scale({
      value: {
        nice: true,
      }
    });

    chart.tooltip({
      showCrosshairs: true,
      shared: true
    });
    // Y\u8F74\u5355\u4F4D
    chart.annotation().text({
      position: [2015, 8],
      content: '\u4E07\u7ACB\u65B9/\u82F1\u5C3A',
      style: {
        fill: '#8c8c8c',
        fontWeight: 300
      },
      offsetY: -30,
      offsetX: -20
    });
    // export mexico
    chart.annotation().text({
      position: [2040, 6.3],
      content: '\u51FA\u53E3\u81F3\u58A8\u897F\u54E5',
      style: {
        fill: '#eee',
        fontWeight: 300,
        textAlign: 'end',
        textBaseline: 'center'
      },
      offsetX: -10
    });
    // export canada
    chart.annotation().text({
      position: [2040, 5],
      content: '\u51FA\u53E3\u81F3\u52A0\u62FF\u5927',
      style: {
        fill: '#eee',
        fontWeight: 300,
        textAlign: 'end',
        textBaseline: 'center'
      },
      offsetX: -10
    });
    // export nature
    chart.annotation().text({
      top: true,
      position: [2040, 2],
      content: '\u6765\u81EA40\u4E2A\u5DDE\u7684\u6DB2\u5316\u5929\u7136\u6C14\u51FA\u53E3',
      style: {
        fill: '#eee',
        fontWeight: 300,
        textAlign: 'end',
        textBaseline: 'center'
      },
      offsetX: -10
    });
    // import canada
    chart.annotation().text({
      position: [2015, -1.5],
      content: '\u4ECE\u52A0\u62FF\u5927\u8FDB\u53E3',
      style: {
        fill: '#eee',
        fontWeight: 300,
        textAlign: 'start',
        textBaseline: 'center'
      },
      offsetX: 10
    });
    // import nature
    chart.annotation().text({
      position: [2019, -3.5],
      content: '\u4ECE\u5176\u4ED6\u56FD\u5BB6\u8FDB\u53E3',
      style: {
        fill: '#6b6b6b',
        fontWeight: 300,
        textAlign: 'start',
        textBaseline: 'center'
      },
    });

    chart.annotation().region({
      start: [2019, 8],
      end: [2040, -4],
      style: {
        lineWidth: 0,
        fill: '#dcdcdc',
        fillOpacity: 0.3,
        stroke: '#ccc'
      }
    });

    chart.legend(false);
    chart
      .area()
      .adjust('stack')
      .position('year*value')
      .color('type', ['#1890ff', '#40a9ff', '#0050b3', '#003a8c', '#002766'])
      .style({
        fillOpacity: 1,
      });
    chart
      .line()
      .adjust('stack')
      .position('year*value')
      .color('type', ['white'])
      .size(1)
      .tooltip(false)
      .style({
        fillOpacity: 0.2,
      });;
    chart.render();
  });
`,title:{zh:"\u7F8E\u56FD\u5929\u7136\u6C14\u8FDB\u51FA\u53E3\u60C5\u51B5\uFF0C2015 - 2040 \u5E74",en:"The United States imports and exports of natural gas"},filename:"area4.ts",isNew:!1},{id:"area5",screenshot:"https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*hGBYTpJauooAAAAAAAAAAABkARQnAQ",source:"import _ from 'lodash';\n\ndocument.getElementById('container').innerHTML = `a-{${_}}`;\n",title:{zh:"\u67D0\u9891\u9053\u89C6\u9891\u8BA2\u9605\u6570\u548C\u6708\u6536\u5165\u5173\u7CFB",en:"Range Area Chart"},filename:"area5.ts",isNew:!0}],icon:"",id:"area",title:{en:"Area Chart",zh:"\u9762\u79EF\u56FE"}},{demos:[{id:"bar1",screenshot:"https://gw.alipayobjects.com/mdn/rms_f5c722/afts/img/A*62ClRKVbiIYAAAAAAAAAAABkARQnAQ",source:`import { Chart } from '@antv/g2';

const data = [
  { type: '\u6C7D\u8F66', value: 34 },
  { type: '\u5EFA\u6750\u5BB6\u5C45', value: 85 },
  { type: '\u4F4F\u5BBF\u65C5\u6E38', value: 103 },
  { type: '\u4EA4\u901A\u8FD0\u8F93\u4E0E\u4ED3\u50A8\u90AE\u653F', value: 142 },
  { type: '\u5EFA\u7B51\u623F\u5730\u4EA7', value: 251 },
  { type: '\u6559\u80B2', value: 367 },
  { type: 'IT \u901A\u8BAF\u7535\u5B50', value: 491 },
  { type: '\u793E\u4F1A\u516C\u5171\u7BA1\u7406', value: 672 },
  { type: '\u533B\u7597\u536B\u751F', value: 868 },
  { type: '\u91D1\u878D\u4FDD\u9669', value: 1234 },
];
const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 500,
});
chart.data(data);
chart.scale({
  value: {
    max: 1400,
    min: 0,
    alias: '\u9500\u91CF\uFF08\u767E\u4E07\uFF09',
  },
});
chart.axis('type', {
  title: null,
  tickLine: null,
  line: null,
});

chart.axis('value', {
  label: null,
  title: {
    offset: 30,
    style: {
      fontSize: 12,
      fontWeight: 300,
    },
  },
});
chart.legend(false);
chart.coordinate().transpose();
chart
  .interval()
  .position('type*value')
  .size(26)
  .label('value', {
    style: {
      fill: '#8d8d8d',
    },
    offset: 10,
  });
chart.interaction('element-active');
chart.render();
`,title:{zh:"\u67D0\u4EA7\u54C1\u884C\u4E1A\u9500\u91CF\u5206\u5E03 Top10",en:"Top 10 sales distribution"},filename:"bar1.ts",isNew:!1},{id:"bar2",screenshot:"https://gw.alipayobjects.com/mdn/rms_f5c722/afts/img/A*uM-VQIO9obEAAAAAAAAAAABkARQnAQ",source:`import { Chart } from '@antv/g2';

const data = [
  { type: '\u6536\u7EB3', value: 340, cat: '\u529E\u516C\u7528\u54C1' },
  { type: '\u7B14', value: 20760, cat: '\u529E\u516C\u7528\u54C1' },
  { type: '\u7EB8\u5F20', value: 28750, cat: '\u529E\u516C\u7528\u54C1' },
  { type: '\u914D\u4EF6', value: 4090, cat: '\u6280\u672F' },
  { type: '\u7535\u8BDD', value: 9880, cat: '\u6280\u672F' },
  { type: '\u590D\u5370\u673A', value: 40988, cat: '\u6280\u672F' },
  { type: '\u684C\u5B50', value: 14870, cat: '\u5BB6\u5177' },
  { type: '\u6905\u5B50', value: 37098, cat: '\u5BB6\u5177' },
  { type: '\u4E66\u67B6', value: 49099, cat: '\u5BB6\u5177' },
];
const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 500,
  padding: [20, 0, 50, 100],
});
chart.data(data);
chart.scale({
  value: {
    max: 55000,
    min: 0,
    alias: '\u91D1\u989D\uFF08\u5143\uFF09',
  },
});
chart.axis('type', {
  tickLine: null,
  line: null,
});
chart.axis('value', {
  label: null,
  title: {
    offset: 30,
    style: {
      fontWeight: 300,
    },
  },
  grid: null,
});
chart.legend(false);
chart.coordinate('rect').transpose();
chart
  .interval()
  .position('type*value')
  .color('cat', ['#face1d', '#37c461', '#2194ff'])
  .size(26)
  .label('value', {
    style: {
      fill: '#8d8d8d',
    },
    offset: 10,
    content: (originData) => {
      return (originData.value + '').replace(/(\\d)(?=(?:\\d{3})+$)/g, '$1,');
    },
  });

chart.annotation().text({
  top: true,
  position: ['\u6905\u5B50', 'min'],
  content: '\u5BB6\u5177',
  style: {
    fill: '#c0c0c0',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
  },
  offsetX: -70,
  rotate: Math.PI * -0.5
});
chart.annotation().text({
  top: true,
  position: ['\u7535\u8BDD', 'min'],
  content: '\u6280\u672F',
  style: {
    fill: '#c0c0c0',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
  },
  offsetX: -70,
  rotate: Math.PI * -0.5
});
chart.annotation().text({
  top: true,
  position: ['\u7B14', 'min'],
  content: '\u529E\u516C\u7528\u54C1',
  style: {
    fill: '#c0c0c0',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
  },
  offsetX: -70,
  rotate: Math.PI * -0.5
});
chart.annotation().line({
  start: ['-20%', '33.2%'],
  end: ['100%', '33.2%'],
  style: {
    stroke: '#c0c0c0',
    lineDash: [2, 2],
  },
});
chart.annotation().line({
  start: ['-20%', '66.8%'],
  end: ['100%', '66.8%'],
  style: {
    stroke: '#c0c0c0',
    lineDash: [2, 2],
  },
});
chart.interaction('element-active');

chart.render();
`,title:{zh:"\u4EA7\u54C1\u7C7B\u522B\u9500\u552E\u989D\u5BF9\u6BD4",en:"Product category sales comparison"},filename:"bar2.ts",isNew:!1},{id:"bar3",screenshot:"https://gw.alipayobjects.com/mdn/rms_f5c722/afts/img/A*f00kS5nEwYMAAAAAAAAAAABkARQnAQ",source:`import { Chart } from '@antv/g2';

const data = [
  { city: '\u4E2D\u56FD\uFF08\u5317\u4EAC\uFF09', type: '\u9996\u90FD\u4EBA\u53E3', value: 0.01 },
  { city: '\u4E2D\u56FD\uFF08\u5317\u4EAC\uFF09', type: '\u57CE\u5E02\u4EBA\u53E3', value: 0.53 },
  { city: '\u4E2D\u56FD\uFF08\u5317\u4EAC\uFF09', type: '\u519C\u6751\u4EBA\u53E3', value: 0.46 },
  { city: '\u7F8E\u56FD\uFF08\u534E\u76DB\u987F\uFF09', type: '\u9996\u90FD\u4EBA\u53E3', value: 0.01 },
  { city: '\u7F8E\u56FD\uFF08\u534E\u76DB\u987F\uFF09', type: '\u57CE\u5E02\u4EBA\u53E3', value: 0.8 },
  { city: '\u7F8E\u56FD\uFF08\u534E\u76DB\u987F\uFF09', type: '\u519C\u6751\u4EBA\u53E3', value: 0.19 },
  { city: '\u5370\u5EA6\uFF08\u5FB7\u91CC\uFF09', type: '\u9996\u90FD\u4EBA\u53E3', value: 0.02 },
  { city: '\u5370\u5EA6\uFF08\u5FB7\u91CC\uFF09', type: '\u57CE\u5E02\u4EBA\u53E3', value: 0.3 },
  { city: '\u5370\u5EA6\uFF08\u5FB7\u91CC\uFF09', type: '\u519C\u6751\u4EBA\u53E3', value: 0.68 },
  { city: '\u4FC4\u7F57\u65AF\uFF08\u83AB\u65AF\u79D1\uFF09', type: '\u9996\u90FD\u4EBA\u53E3', value: 0.08 },
  { city: '\u4FC4\u7F57\u65AF\uFF08\u83AB\u65AF\u79D1\uFF09', type: '\u57CE\u5E02\u4EBA\u53E3', value: 0.66 },
  { city: '\u4FC4\u7F57\u65AF\uFF08\u83AB\u65AF\u79D1\uFF09', type: '\u519C\u6751\u4EBA\u53E3', value: 0.26 },
  { city: '\u6CD5\u56FD\uFF08\u5DF4\u9ECE\uFF09', type: '\u9996\u90FD\u4EBA\u53E3', value: 0.16 },
  { city: '\u6CD5\u56FD\uFF08\u5DF4\u9ECE\uFF09', type: '\u57CE\u5E02\u4EBA\u53E3', value: 0.63 },
  { city: '\u6CD5\u56FD\uFF08\u5DF4\u9ECE\uFF09', type: '\u519C\u6751\u4EBA\u53E3', value: 0.21 },
  { city: '\u97E9\u56FD\uFF08\u9996\u5C14\uFF09', type: '\u9996\u90FD\u4EBA\u53E3', value: 0.19 },
  { city: '\u97E9\u56FD\uFF08\u9996\u5C14\uFF09', type: '\u57CE\u5E02\u4EBA\u53E3', value: 0.63 },
  { city: '\u97E9\u56FD\uFF08\u9996\u5C14\uFF09', type: '\u519C\u6751\u4EBA\u53E3', value: 0.18 },
  { city: '\u4E39\u9EA6\uFF08\u54E5\u672C\u54C8\u6839\uFF09', type: '\u9996\u90FD\u4EBA\u53E3', value: 0.22 },
  { city: '\u4E39\u9EA6\uFF08\u54E5\u672C\u54C8\u6839\uFF09', type: '\u57CE\u5E02\u4EBA\u53E3', value: 0.65 },
  { city: '\u4E39\u9EA6\uFF08\u54E5\u672C\u54C8\u6839\uFF09', type: '\u519C\u6751\u4EBA\u53E3', value: 0.13 },
  { city: '\u51B0\u5C9B\uFF08\u96F7\u514B\u96C5\u672A\u514B\uFF09', type: '\u9996\u90FD\u4EBA\u53E3', value: 0.56 },
  { city: '\u51B0\u5C9B\uFF08\u96F7\u514B\u96C5\u672A\u514B\uFF09', type: '\u57CE\u5E02\u4EBA\u53E3', value: 0.38 },
  { city: '\u51B0\u5C9B\uFF08\u96F7\u514B\u96C5\u672A\u514B\uFF09', type: '\u519C\u6751\u4EBA\u53E3', value: 0.06 },
];

const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 500,
});
chart.data(data);
chart.scale('value', {

  alias: '\u5360\u6BD4\uFF08%\uFF09',
});
chart.axis('city', {
  tickLine: null,
  line: null,
});
chart.axis('value', {
  label: null,
  title: {
    style: {
      fontSize: 14,
      fontWeight: 300,
    },
  },
  grid: null,
});
chart.legend({
  position: 'top',
});
chart.coordinate('rect').transpose();
chart.tooltip({
  shared: true,
  showMarkers: false,
});
chart.interaction('active-region');
chart
  .interval()
  .adjust('stack')
  .position('city*value')
  .color('type*city', (type, city) => {
    if (type === '\u9996\u90FD\u4EBA\u53E3') {
      return '#1890ff';
    }
    if (type === '\u57CE\u5E02\u4EBA\u53E3') {
      return '#ced4d9';
    }
    if (type === '\u519C\u6751\u4EBA\u53E3') {
      return '#f0f2f3';
    }
    if (type === '\u9996\u90FD\u4EBA\u53E3' && city === '\u4E2D\u56FD\uFF08\u5317\u4EAC\uFF09') {
      return '#f5222d';
    }
  })
  .size(26)
  .label('value*type', (val, t) => {
    const color = t === '\u9996\u90FD\u4EBA\u53E3' ? 'white' : '#47494b';
    if (val < 0.05) {
      return null;
    }
    return {
      position: 'middle',
      offset: 0,
      style: {
        fontSize: 12,
        fill: color,
        lineWidth: 0,
        stroke: null,
        shadowBlur: 2,
        shadowColor: 'rgba(0, 0, 0, .45)',
      },
    };
  });
chart.render();
`,title:{zh:"\u8C01\u4F4F\u5728\u9996\u90FD\uFF1F",en:"Who lives in the capital?"},filename:"bar3.ts",isNew:!1}],icon:"",id:"bar",title:{en:"Bar Chart",zh:"\u6761\u5F62\u56FE"}}]}]}},children:l})}},62594:function(i,t,n){n.d(t,{w:function(){return a}});var e=n(1201),a=(0,e.createContext)({})}}]);
