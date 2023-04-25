import type { Root } from 'hast';

let visit: typeof import('unist-util-visit').visit;

(async () => {
  ({ visit } = await import('unist-util-visit'));
})();

function isObservable(node) {
  if (!node.data) return;
  const { meta } = node.data;
  if (!meta) return;
  return meta.match(/\|\s*ob\s*{*/);
}

// 对于标记了 ```js | ob {} 形式的代码进行处理
export default function rehypeObservable() {
  return async (tree) => {
    visit<Root, 'element'>(tree, 'element', (node, i, parent) => {
      if (!isObservable(node)) return;
      // <SourceCode /> => <div><p></p><SourceCode /></div>
      // 通过 p 标签去存储 meta 信息以及标记后面的代码块需要被渲染运行
      if (node.tagName === 'SourceCode') {
        parent!.children.splice(i, 1, {
          type: 'element',
          tagName: 'div',
          properties: {
            class: 'ob-codeblock',
          },
          children: [
            {
              type: 'element',
              tagName: 'p',
              properties: { meta: node.data.meta as string },
              children: [],
            },
            { ...node },
          ],
        });
      }
    });
  };
}
