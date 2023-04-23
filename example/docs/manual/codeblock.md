---
order: 4
title: Codeblock
---

## Basic

<p class="preview"></p>

```js
(() => {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.background = 'red';
  return div;
})();
```

## Clear

<p class="preview"></p>

```js
(() => {
  const span = document.createElement('span');
  span.textContent = 1;
  span.style.fontSize = '30px';

  const timer = setInterval(
    () => (span.textContent = +span.textContent + 1),
    1000,
  );

  // 清空监听器
  span.clear = () => {
    clearInterval(timer);
  };
  return span;
})();
```

## Pin

<p class="preview" _pin="false"></p>

```js
(() => {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.background = 'red';
  return div;
})();
```

## Promise

<p class="preview" ></p>

```js
(() => {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.background = 'red';
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(div);
    }, 1000);
  });
})();
```

## Error

<p class="preview" ></p>

```js
(() => {
  const div = document.createElement('div');
  console.log(a);
  return div;
})();
```

## Reject

<p class="preview" ></p>

```js
(() => {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.background = 'red';
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('reject promise');
    }, 1000);
  });
})();
```

## Comments

<p class="preview"></p>

```js
(() => {
  // 第一行注释
  const div = document.createElement('div');

  // 第二行注释
  div.style.width = '100px';

  /*
   * 注释1
   * 注释2
   */
  div.style.height = '100px';

  /*
   * 注释3
   * 注释4
   */
  div.style.background = 'red';

  return div;
})();
```

## Non-DOM

<p class="preview"></p>

```js
function add(x, y) {
  return x + y;
}
```

## Global

<p class="preview"></p>

```js
globalAdd(1, 2);
```

## React

<p class="preview"></p>

```js
globalCard('world');
```

## G2

<p class="preview" ></p>

```js
(() => {
  const chart = new g2.Chart({ theme: 'classic' });
  chart
    .interval()
    .data([
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 },
    ])
    .encode('x', 'genre')
    .encode('y', 'sold');
  return chart.render().then((chart) => {
    const container = chart.getContainer();
    container.clear = () => chart.destroy();
    return container;
  });
})();
```
