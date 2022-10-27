import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';

fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/diamond.json')
  .then((res) => res.json())
  .then((data) => {
    const ds = new DataSet();
    const dv = ds.createView('diamond').source(data);
    dv.transform({
      type: 'bin.histogram',
      field: 'depth',
      binWidth: 4, // 在此修改矩形的宽度，代表真实数值的大小
      as: ['depth', 'count'],
    });

    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500,
    });
    chart.data(dv.rows);

    chart.scale({
      depth: {
        tickInterval: 4,
      },
      count: {
        nice: true,
      }
    });

    chart.tooltip({
      position: 'top',
      showMarkers: false,
    });

    chart.interval().position('depth*count');

    chart.interaction('element-highlight');

    chart.render();
  });
