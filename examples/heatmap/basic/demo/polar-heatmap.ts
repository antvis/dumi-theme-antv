import { Chart } from '@antv/g2';

fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/polar-heatmap.json')
  .then(res => res.json())
  .then(data => {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500,
      padding: 40
    });
    chart.data(data);
    chart.tooltip({
      showTitle: null,
      showMarkers: false
    });
    chart.coordinate('polar', {
      innerRadius: 0.2
    });
    chart.legend(false);
    chart.axis('week', {
      grid: null,
      line: null,
      tickLine: null,
      label: null
    });
    chart.axis('time', {
      line: null,
      tickLine: null,
      grid: null,
      label: {
        offset: 3
      }
    });
    chart.polygon()
      .position('time*week')
      .color('value', '#BAE7FF-#1890FF-#0050B3')
      .tooltip('week*time*value')
      .style({
        stroke: '#fff',
        lineWidth: 1
      });

    chart.interaction('element-active');

    const values = ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'];
    values.map((val, idx) => {
      chart.annotation().text({
        top: true,
        position: [0, idx],
        content: val,
        style: {
          fill: '#fff',
          textAlign: 'center',
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)'
        }
      });

      return null;
    });
    chart.render();
  });
