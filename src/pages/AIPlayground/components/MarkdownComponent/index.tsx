import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { MarkdownCodeBlock } from './MarkdownCodeBlock'; // 引入我们创建的自定义组件

interface MarkdownComponentProps {
  content: string;
}

export const MarkdownComponent: React.FC<MarkdownComponentProps> = ({ content }) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // 1. 重写 `p` 标签的渲染
        p(props) {
          const { node, ...rest } = props;
          return <p style={{ marginBottom: 'unset', lineHeight: '1.6' }} {...rest} />;
        },

        // 2. 【核心】重写 `code` 标签的渲染，使用我们自己的组件
        code(props) {
          return <MarkdownCodeBlock {...props} />;
        },

        // 3. 重写非标准 `description` 标签的渲染
        // @ts-expect-error - 告知 TypeScript 我们知道这是一个自定义的、非标准的 HTML 标签
        description(props) {
          return <span style={{ fontSize: '12px', color: '#777', display: 'block' }} {...props} />;
        },

        // 你还可以重写更多...
        // h1: (props) => <h1 style={{ color: 'blue' }} {...props} />,
        // a: (props) => <a style={{ color: 'green' }} target="_blank" rel="noopener noreferrer" {...props} />,
      }}
    >
      {content}
    </Markdown>
  );
};
