import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Preview } from './Preview';

function optionsOf(p) {
  const keys = ['_pin', '_only'];
  return Object.fromEntries(keys.map((key) => [key, p.getAttribute(key)]));
}

function sourceOf(block: Element) {
  const cloned = block.cloneNode(true) as Element;
  // 去掉 comments
  const comments = Array.from(cloned.querySelectorAll('.comment'));
  comments.forEach((comment) => comment.remove());
  return cloned.textContent;
}

export function usePreview(options = {}) {
  useEffect(() => {
    const blocks = Array.from(
      document.querySelectorAll(
        '.markdown .preview + .dumi-default-source-code',
      ),
    );

    // 过滤实际展示的 block
    const I = Array.from({ length: blocks.length }, (_, i) => i);
    const OI = I.filter((i) => {
      const p = blocks[i].previousSibling;
      const options = optionsOf(p);
      const { _only } = options;
      return _only === 'true';
    });
    const FI = OI.length === 0 ? I : OI;

    // 将 p 标签替换成渲染后结果
    const W = [];
    const P = [];
    for (const i of FI) {
      const block = blocks[i];
      const source = sourceOf(block);
      const p = block.previousSibling;

      // 渲染并且挂载代码运行结果
      const wrapper = document.createElement('div');
      const options = optionsOf(p);
      const root = createRoot(wrapper);
      root.render(<Preview source={source} code={block} {...options} />);
      p.replaceWith(wrapper);

      W[i] = wrapper;
      P[i] = p;
    }

    return () => {
      // 复原
      for (const i of FI) {
        const wrapper = W[i];
        const p = P[i];
        wrapper.replaceWith(p);
      }
    };
  });
}
