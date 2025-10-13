export const projectFiles = {
  "/package.json": {
    code: `{
      "name": "antv-g2-example",
      "version": "1.0.0",
      "main": "/index.js",
      "dependencies": {
        "@antv/g2": "^5"
      }
    }`
  },
  "/index.js": { // 入口文件是纯 JS
    code: `import { Chart } from '@antv/g2';

    const chart = new Chart({
      container: 'root',
    });

    chart.options({
      type: 'interval',
      autoFit: true,
      data: [
        { grade: '一年级', count: 200 },
        { grade: '二年级', count: 250 },
        { grade: '三年级', count: 300 },
        { grade: '四年级', count: 350 },
      ],
      encode: { x: 'grade', y: 'count' },
    });

    chart.render();
    `
  },
  "/index.html": {
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Vanilla JS Example</title>
</head>
<body>
  <h1>纯 JavaScript 示例</h1>
  <div id="root"></div>
  <script src="index.js"></script>
</body>
</html>`
  },
};
