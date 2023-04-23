import { Chart } from '@antv/g2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json',
)
  .then((res) => res.json())
  .then((data) => data.map((d) => ({ ...d, Date: new Date(d.Date) })))
  .then((data) => {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      theme: 'classic',
    });

    chart
      .line()
      .data(data)
      .encode('x', 'Date')
      .encode('y', 'scales')
      .encode('color', 'steelblue')
      .axis('y', { tickFormatter: '.0%' });

    chart.render();
  });
