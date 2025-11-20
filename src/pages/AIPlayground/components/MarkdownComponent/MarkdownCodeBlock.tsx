import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AIChatStore } from '../../../../model/AIChat';
import { useCopyToClipboard } from 'react-use';
import { CheckOutlined, CopyOutlined, PlaySquareOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import styles from './MarkdownCodeBlock.module.less';
import { useIntl } from 'dumi'; // 定义 props 类型，它将接收 react-markdown 传递的所有属性

// 定义 props 类型，它将接收 react-markdown 传递的所有属性
interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  showRunButton?: boolean;
}

export const MarkdownCodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
  showRunButton: showRunButtonProp = true,
}) => {
  const intl = useIntl();
  const [copyState, copyToClipboard] = useCopyToClipboard();
  // 1. 处理行内代码：如果是行内代码，不做特殊处理，直接返回一个 <code> 标签
  if (inline || (typeof children === 'string' && !children.includes('\n'))) {
    return <code className={className}>{children}</code>;
  }

  // 2. 提取语言：从 className 中提取代码语言，例如 "language-javascript" -> "javascript"
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text'; // 如果没有指定语言，默认为纯文本

  // 3. 将 children 转换为字符串，并移除末尾的换行符
  const codeString = String(children).replace(/\n$/, '');

  // 4. 判断是否显示“运行”按钮
  const showRunButton = showRunButtonProp && /\bimport\b/.test(codeString);

  // 5. 定义运行代码的逻辑
  const handleRunCode = () => {
    // console.log("准备运行的代码:", codeString);
    AIChatStore.codeBlock = codeString;
  };

  // 6. 返回最终的 JSX 结构
  return (
    <div style={{ position: 'relative', margin: '1em 0' }}>
      <Space className={styles.button}>
        <Tooltip title={intl.formatMessage({ id: 'ai.markdown.copy' })}>
          <Button
            variant="link"
            size="small"
            onClick={() => copyToClipboard(codeString)}
            title={intl.formatMessage({ id: 'ai.markdown.copy' })}
          >
            {copyState.value === codeString ? <CheckOutlined /> : <CopyOutlined />}
          </Button>
        </Tooltip>
        {/* 条件渲染"运行"按钮 */}
        {showRunButton && (
          <Tooltip title={intl.formatMessage({ id: 'ai.markdown.run' })}>
            <Button
              variant="link"
              size="small"
              onClick={handleRunCode}
              title={intl.formatMessage({ id: 'ai.markdown.run' })}
            >
              <PlaySquareOutlined />
            </Button>
          </Tooltip>
        )}
      </Space>
      {/* 使用 react-syntax-highlighter 进行代码高亮 */}
      <SyntaxHighlighter
        style={oneLight}
        language={language === 'vue' ? 'html': language}
        PreTag="div" // 使用 div 作为外层标签，避免 pre 标签的默认样式冲突
        showLineNumbers={false} // (可选) 显示行号
        customStyle={{
          paddingTop: '2em',
          background: '#fafafa'
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
