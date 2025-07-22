---
order: 4
title: Codeblock
---

## Simple React Component Test

```js | ob { inject: true }
import React from 'react';

export default function SimpleTest() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f8ff', 
      border: '2px solid #4169e1',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#4169e1', margin: '0 0 10px 0' }}>
        🎉 React Component Works!
      </h2>
      <p style={{ margin: 0, fontSize: '16px' }}>
        This is a simple React component rendered successfully.
      </p>
    </div>
  );
}
```

## Pure

```js
(() => {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.background = 'red';
  return div;
})();
```

## Basic

```js | ob
(() => {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.background = 'red';
  return div;
})();
```

## Clear

```js | ob
(() => {
  const span = document.createElement('span');
  span.textContent = 1;
  span.style.fontSize = '30px';

  const timer = setInterval(() => (span.textContent = +span.textContent + 1), 1000);

  // 清空监听器
  span.clear = () => {
    clearInterval(timer);
  };
  return span;
})();
```

## Pin

```js | ob {pin: false}
(() => {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.background = 'red';
  return div;
})();
```

## Promise

```js | ob
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

```js | ob
(() => {
  const div = document.createElement('div');
  console.log(a);
  return div;
})();
```

## Reject

```js | ob
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

```js | ob
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

```js | ob
function add(x, y) {
  return x + y;
}
```

## Global

```js | ob
globalAdd(1, 2);
```

## React

```js | ob
globalCard('world');
```

## G2

```js | ob
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

## G2 inject

```js | ob { inject: true  }
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

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

chart.render();
```

## G2 inject & unpin

```js | ob { pin: false, inject: true  }
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

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

chart.render();
```

### react component

```js | ob { inject: true }
import React from 'react';

export default () => {
  return <div>component</div>;
};
```

### react component with props

```js | ob { inject: true }
import React from 'react';

export default function MyComponent() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Counter: {count}</h3>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### react component with hooks

```js | ob { inject: true }
import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>Current Time</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {time.toLocaleTimeString()}
      </p>
    </div>
  );
}
```
