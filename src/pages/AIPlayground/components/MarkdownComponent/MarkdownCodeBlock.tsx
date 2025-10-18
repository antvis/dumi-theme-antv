import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {a11yLight} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { AIChatStore } from "../../../../model/AIChat";

// 定义 props 类型，它将接收 react-markdown 传递的所有属性
interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const MarkdownCodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  // 1. 处理行内代码：如果是行内代码，不做特殊处理，直接返回一个 <code> 标签
  if (inline || (typeof children === 'string' && !children.includes("\n"))) {
    return <code className={className}>{children}</code>;
  }

  // 2. 提取语言：从 className 中提取代码语言，例如 "language-javascript" -> "javascript"
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text'; // 如果没有指定语言，默认为纯文本

  // 3. 将 children 转换为字符串，并移除末尾的换行符
  const codeString = String(children).replace(/\n$/, '');

  // 4. 实现核心逻辑：判断是否显示“运行”按钮
  const showRunButton = codeString.trim().startsWith('import');

  // 5. 定义运行代码的逻辑
  const handleRunCode = () => {
    // console.log("准备运行的代码:", codeString);
    AIChatStore.codeBlock = codeString;
  };

  // 6. 返回最终的 JSX 结构
  return (
    <div style={{ position: 'relative', margin: '1em 0' }}>
      {/* 条件渲染“运行”按钮 */}
      {showRunButton && (
        <button
          type="button"
          onClick={handleRunCode}
          style={{
            position: 'absolute',
            top: '0.5em',
            right: '0.5em',
            zIndex: 1,
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#4a4a4a',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.8em',
          }}
          title="运行此代码片段"
        >
          运行
        </button>
      )}

      {/* 使用 react-syntax-highlighter 进行代码高亮 */}
      <SyntaxHighlighter
        style={a11yLight}
        language={language}
        PreTag="div" // 使用 div 作为外层标签，避免 pre 标签的默认样式冲突
        showLineNumbers={false} // (可选) 显示行号
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
