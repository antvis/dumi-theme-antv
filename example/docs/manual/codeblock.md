---
order: 4
title: Codeblock
---


## 原代码块格式 支持编辑
```js | ob {editable:true}
(() => {
  const alignList = ['center', 'right', 'left'];
  const alignMap = alignList.map((p) => {
    return {
      label: p,
      value: p,
    };
  });
  const chart = new g2.Chart({
    width: 480,
    height: 160,
  });

  const data = [
    264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513,
    546, 983, 340, 539, 243, 226, 192,
  ];

  chart.options({
    data,
    type: 'interval',
    encode: {
      x: (_, idx) => idx,
      y: (d) => d,
    },
    title: {
      align: 'center',
      title: 'This is a chart title.',
      subtitle: 'Displayed are sampled values.',
    },
    axis: false,
  });
  const handleSetAlign = (align) => {
    chart.title({ align });
    chart.render(); // 重新渲染图表
  };

  const selectorContainer = document.createElement('div');
  selectorContainer.textContent = '选择标题对齐方式 ';
  const selector = document.createElement('select');
  selector.innerHTML = alignMap.map(
    (align, index) =>
      `<option value="${align.value}" ${index === 0 ? 'selected' : ''}>${
        align.label
      }</option>`,
  );
  selector.onchange = (e) => {
    handleSetAlign(e.target.value);
  };
  selectorContainer.appendChild(selector);
  const node = chart.getContainer();
  node.insertBefore(selectorContainer, node.childNodes[0]);
  chart.render();

  return node;
})();
```


## 支持图表样例js文件内容

```js | ob {pin:true, editable:true, compile:true}
import { Chart } from '@antv/g2';

const data = [
  { letter: 'A', frequency: 0.08167 },
  { letter: 'B', frequency: 0.01492 },
  { letter: 'C', frequency: 0.02782 },
  { letter: 'D', frequency: 0.04253 },
  { letter: 'E', frequency: 0.12702 },
  { letter: 'F', frequency: 0.02288 },
  { letter: 'G', frequency: 0.02015 },
  { letter: 'H', frequency: 0.06094 },
  { letter: 'I', frequency: 0.06966 },
  { letter: 'J', frequency: 0.00153 },
  { letter: 'K', frequency: 0.00772 },
  { letter: 'L', frequency: 0.04025 },
  { letter: 'M', frequency: 0.02406 },
  { letter: 'N', frequency: 0.06749 },
  { letter: 'O', frequency: 0.07507 },
  { letter: 'P', frequency: 0.01929 },
  { letter: 'Q', frequency: 0.00095 },
  { letter: 'R', frequency: 0.05987 },
  { letter: 'S', frequency: 0.06327 },
  { letter: 'T', frequency: 0.09056 },
  { letter: 'U', frequency: 0.02758 },
  { letter: 'V', frequency: 0.00978 },
  { letter: 'W', frequency: 0.0236 },
  { letter: 'X', frequency: 0.0015 },
  { letter: 'Y', frequency: 0.01974 },
  { letter: 'Z', frequency: 0.00074 },
];
const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.interval().data(data).encode('x', 'letter').encode('y', 'frequency');

chart.render();

```

