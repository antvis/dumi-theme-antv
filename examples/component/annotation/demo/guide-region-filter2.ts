import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';

const data = [
  { year: 1700, exports: 35, imports: 70 },
  { year: 1710, exports: 59, imports: 81 },
  { year: 1720, exports: 76, imports: 96 },
  { year: 1730, exports: 65, imports: 97 },
  { year: 1740, exports: 67, imports: 93 },
  { year: 1750, exports: 79, imports: 90 },
  { year: 1760, exports: 115, imports: 79 },
  { year: 1770, exports: 163, imports: 85 },
  { year: 1780, exports: 185, imports: 93 }
];
const ds = new DataSet();
const dv = ds.createView().source(data);
dv.transform({
  type: 'map',
  callback(row) {
    row.range = [row.exports, row.imports];
    return row;
  }
});
dv.transform({
  type: 'fold',
  fields: ['exports', 'imports'], // 展开字段集
  key: 'type', // key字段
  value: 'value' // value字段
});

const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 500
});
chart.data(dv.rows);
chart.scale({
  value: { min: 0, max: 200 },
  range: { min: 0, max: 200 },
});
chart.axis('range', false);
chart.tooltip({
  showCrosshairs: true,
});
chart.line().position('year*value').color('type', ['#F5222D', '#FAAD14'])
  .size(2.5)
  .shape('smooth');
chart.area().position('year*range').color('#ffffff')
  .shape('smooth')
  .tooltip(false);
chart.annotation().regionFilter({
  top: true,
  start: [1700, 'min'],
  end: [1753, 'max'],
  color: '#F5222D',
  apply: ['area']
});
chart.annotation().regionFilter({
  top: true,
  start: [1753, 'min'],
  end: [1780, 'max'],
  color: '#FAAD14',
  apply: ['area']
});
chart.annotation().dataMarker({
  position: [1753, 87],
  text: {
    content: '1755 年在印度周边建立诸多殖民\n地与附属国，垄断出口贸易，导致\n出品总额激增。',
    style: { textAlign: 'left', fontSize: 13 },
  },
  line: {
    length: 50,
  },
  point: {
    style: {
      stroke: '#FF4D4F'
    },
  },
  direction: 'downward'
});
chart.annotation().text({
  top: true,
  position: [1730, 80],
  content: '贸易赤字',
  style: {
    fontSize: 12,
    fontWeight: 'normal',
    fill: 'rgba(0,0,0,0.45)'
  }
});
chart.annotation().text({
  top: true,
  position: [1765, 110],
  content: '贸易盈余',
  style: {
    fontSize: 12,
    fontWeight: 'normal',
    fill: 'rgba(0,0,0,0.45)'
  }
});
chart.render();

