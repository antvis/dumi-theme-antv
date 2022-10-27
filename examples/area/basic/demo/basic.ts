import { Chart } from '@antv/g2';

const data = [
  { year: '1991', value: 15468 },
  { year: '1992', value: 16100 },
  { year: '1993', value: 15900 },
  { year: '1994', value: 17409 },
  { year: '1995', value: 17000 },
  { year: '1996', value: 31056 },
  { year: '1997', value: 31982 },
  { year: '1998', value: 32040 },
  { year: '1999', value: 33233 },
];
const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 500,
});

chart.data(data);
chart.scale({
  value: {
    min: 10000,
    nice: true,
  },
  year: {
    range: [0, 1],
  },
});
chart.tooltip({
  showCrosshairs: true,
  shared: true,
});

chart.axis('value', {
  label: {
    formatter: (val) => {
      return (+val / 10000).toFixed(1) + 'k';
    },
  },
});

chart.area().position('year*value');
chart.line().position('year*value');

chart.render();
