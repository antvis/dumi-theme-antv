import { DataView } from '@antv/data-set';
import { Chart } from '@antv/g2';

const data = [
  { x: 'Oceania', low: 1, q1: 9, median: 16, q3: 22, high: 24 },
  { x: 'East Europe', low: 1, q1: 5, median: 8, q3: 12, high: 16 },
  { x: 'Australia', low: 1, q1: 8, median: 12, q3: 19, high: 26 },
  { x: 'South America', low: 2, q1: 8, median: 12, q3: 21, high: 28 },
  { x: 'North Africa', low: 1, q1: 8, median: 14, q3: 18, high: 24 },
  { x: 'North America', low: 3, q1: 10, median: 17, q3: 28, high: 30 },
  { x: 'West Europe', low: 1, q1: 7, median: 10, q3: 17, high: 22 },
  { x: 'West Africa', low: 1, q1: 6, median: 8, q3: 13, high: 16 }
];
const dv = new DataView().source(data);
dv.transform({
  type: 'map',
  callback: obj => {
    obj.range = [obj.low, obj.q1, obj.median, obj.q3, obj.high];
    return obj;
  }
});
const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 500
});
chart.data(dv.rows);
chart.scale('range', {
  max: 35,
  nice: true,
});
chart.tooltip({
  showTitle: false,
  showMarkers: false,
  itemTpl: '<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">'
    + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
    + '{name}<br/>'
    + '<span style="padding-left: 16px">最大值：{high}</span><br/>'
    + '<span style="padding-left: 16px">上四分位数：{q3}</span><br/>'
    + '<span style="padding-left: 16px">中位数：{median}</span><br/>'
    + '<span style="padding-left: 16px">下四分位数：{q1}</span><br/>'
    + '<span style="padding-left: 16px">最小值：{low}</span><br/>'
    + '</li>'
});
chart
  .schema()
  .position('x*range')
  .shape('box')
  .tooltip('x*low*q1*median*q3*high', (x, low, q1, median, q3, high) => {
    return {
      name: x,
      low,
      q1,
      median,
      q3,
      high
    };
  })
  .style({
    stroke: '#545454',
    fill: '#1890FF',
    fillOpacity: 0.3
  });

chart.interaction('active-region');

chart.render();
