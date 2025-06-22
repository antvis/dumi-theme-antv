import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import LiveExample from '../../slots/LiveExample';
import { safeEval } from './utils';

function optionsOf(p) {
  try {
    const meta = p.getAttribute('meta');
    const lang = p.getAttribute('lang');
    const matched = meta.match(/\|\s*ob\s*({.*})/)?.[1];
    const obOptions = matched ? safeEval(matched) : {};
    return { ...obOptions, lang };
  } catch (e) {
    console.error(e);
    return {};
  }
}

function sourceOf(block: Element) {
  const cloned = block.cloneNode(true) as Element;

  // 处理 Prism 语法高亮的 pre 元素
  const preElement = cloned.querySelector('pre.prism-code') as HTMLElement;
  if (preElement) {
    const lines = Array.from(preElement.children);
    const codeLines = lines.map((line) => {
      const lineElement = line as HTMLElement;
      return lineElement.innerText || lineElement.textContent || '';
    });

    const code = codeLines.join('\n');
    return code.replace(/\n\s*\n\s*\n/g, '\n\n');
  }

  const code = cloned.textContent || '';
  return code.replace(/\n\s*\n\s*\n/g, '\n\n');
}

function blockOf() {
  if (typeof document !== undefined && document) {
    const blocks = Array.from(document.querySelectorAll('.ob-codeblock .dumi-default-source-code'));
    return blocks;
  }
  return [];
}

export function usePreview(options = {}, select) {
  const key = select + ',' + blockOf().length;

  useEffect(() => {
    const blocks = blockOf();

    // 过滤实际展示的 block
    const I = Array.from({ length: blocks.length }, (_, i) => i);
    const OI = I.filter((i) => {
      const p = blocks[i].previousSibling;
      const options = optionsOf(p);
      const { only = false } = options;
      return only === true;
    });
    const FI = OI.length === 0 ? I : OI;

    // 将 p 标签替换成渲染后结果
    const W = [];
    const P = [];
    for (const i of FI) {
      const block = blocks[i];
      const source = sourceOf(block);
      const p = block.previousSibling as any;

      // 渲染并且挂载代码运行结果
      const wrapper = document.createElement('div');
      const options = optionsOf(p);
      const root = createRoot(wrapper);
      root.render(<LiveExample source={source} {...options} />);
      const container = block.parentElement!;
      container.replaceWith(wrapper);

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
  }, [key]);
}
