import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {a11yLight} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { AIChatStore } from "../../../../model/AIChat";
import {useCopyToClipboard} from "react-use";
import {CheckOutlined, CopyOutlined, PlaySquareOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import styles from "./MarkdownCodeBlock.module.less";

// 定义 props 类型，它将接收 react-markdown 传递的所有属性
interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const MarkdownCodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [copyState, copyToClipboard] = useCopyToClipboard();
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
    <div style={{position: 'relative', margin: '1em 0'}}>
      <Tooltip title="复制">
      <button
        type="button"
        onClick={() => copyToClipboard(codeString)}
        style={{
          right: '3em',
        }}
        className={styles.button}
        title="复制"
      >
        {copyState.value === codeString ? <CheckOutlined /> : <CopyOutlined /> }
      </button>
      </Tooltip>
      {/* 条件渲染“运行”按钮 */}
      {showRunButton && (
        <Tooltip title="运行此代码片段"><button
          type="button"
          onClick={handleRunCode}
          style={{
            right: '0.5em',
          }}
          className={styles.button}
          title="运行此代码片段"
        >
          <PlaySquareOutlined />
        </button></Tooltip>
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
