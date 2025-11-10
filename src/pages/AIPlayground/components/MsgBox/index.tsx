import {
  CheckOutlined,
  CopyOutlined,
  PlusSquareOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Flex, Space, Tooltip } from 'antd';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport, type UIMessage } from 'ai';
import { history, useIntl, useSiteData } from 'dumi';
import { findLast } from 'lodash-es';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useSnapshot } from 'valtio';
import { PromptTextarea } from '../../../../components/AI/HomeDialog/PromptTextarea';
import {
  AIChatStore,
  clearEmptySession,
  createPureNewSession,
  derivedState,
} from '../../../../model/AIChat';
import type { Message } from '../../../../types';
import { getCodeFromMarkdown, isPreviewable } from '../../../../utils/code';
import { MarkdownComponent } from '../MarkdownComponent';
import styles from './index.module.less';
import { useAutoScroll } from './useAutoScroll';
import {getBaseURL} from "../../../../utils/env";

const avatar = {
  icon: (
    <img
      draggable={false}
      src={'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original'}
      alt="AntV"
    />
  ),
  style: { borderRadius: 0, backgroundColor: 'transparent' },
};

const chatScrollIntoView = () => {
  setTimeout(() => {
    document.getElementById('msgBoxAnchor')
    .scrollIntoView({
      block: 'end',
    });
  }, 100);
};


// 辅助函数：将旧的 Message 格式转换为新的 UIMessage 格式
const convertToUIMessages = (messages: readonly Message[]): UIMessage[] => {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: [{ type: 'text', text: msg.content }],
  }));
};

// 辅助函数：从 UIMessage 提取文本内容
const getTextContent = (message: UIMessage): string => {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part as { type: 'text'; text: string }).text)
    .join('');
};

interface MsgBoxProps {
  messages?: Message[];
  simple?: boolean;
  context?: string;
  onCodegen?: (code: string) => void;
  title?: string;
}

function MsgBox(props: MsgBoxProps) {
  const { messages: initialMessages = [], simple = false, onCodegen, title } = props;
  const { themeConfig } = useSiteData();
  const { formatMessage } = useIntl();
  const [lib, setLib] = useState(!themeConfig.isAntVSite ? themeConfig.title : undefined);
  const [promptText, setPromptText] = useState<string>('');
  const [fileSummary, setFileSummary] = useState('');
  const snap = useSnapshot(AIChatStore);
  const derivedSnap = useSnapshot(derivedState);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const latestUserMessage = findLast(derivedSnap.activeSession?.messages, (msg) => msg.role === 'user');
  // 使用 ref 存储动态值，避免重新创建 transport
  const anonymousUserIdRef = useRef(snap.anonymousUserId);
  const activeSessionIdRef = useRef(derivedSnap.activeSession?.id);

  useEffect(() => {
    anonymousUserIdRef.current = snap.anonymousUserId;
    activeSessionIdRef.current = derivedSnap.activeSession?.id;
  }, [snap.anonymousUserId, derivedSnap.activeSession?.id]);

  // 转换初始消息为新格式
  const convertedInitialMessages = useMemo(
    () => convertToUIMessages(initialMessages),
    [initialMessages]
  );

  // 核心：使用 useChat hook，配置 DefaultChatTransport
  const { messages, setMessages, sendMessage, regenerate, status, stop } = useChat({
    transport: new TextStreamChatTransport({
      api: getBaseURL() + '/api/modules/antv/ai/chat',
      credentials: 'include',
      headers: {
        // xxx
      },
      // body 可以是函数，用于获取最新的动态值
      body: () => ({
        gptConversationId: activeSessionIdRef.current,
        anonymousUserId: anonymousUserIdRef.current,
        mountId: 'container',
        antvContext: latestUserMessage?.context || props.context,
        library: latestUserMessage?.lib || lib,
        mode: latestUserMessage?.mode,
      }),
    }),
    messages: convertedInitialMessages,
    // 当AI响应结束时触发
    onFinish: ({ message, isAbort, isDisconnect, isError }) => {
      if (!isAbort && !isDisconnect && !isError) {
        const messageContent = getTextContent(message);
        if (isPreviewable(messageContent)) {
          const codeBlock = getCodeFromMarkdown(messageContent).code;
          AIChatStore.codeBlock = codeBlock;
          onCodegen?.(codeBlock);
        }
        derivedState.activeSession?.messages?.push({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: messageContent,
          createdAt: Date.now(),
        });
      }
    },
    onError: (error) => {
      console.error('回答失败', error);
      // 同步错误消息到 valtio
      derivedState.activeSession?.messages?.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: formatMessage({ id: 'ai.msgbox.error.response' }),
        createdAt: Date.now(),
        // mode,
        // lib,
      });
    },
  });

  // 处理用户提交
  const handleSubmit = () => {
    if (!promptText.trim() || status === 'streaming' || status === 'submitted') return;

    // 使用 sendMessage 函数发送新消息
    // 第二个参数传递每次请求特定的额外数据
    sendMessage(
      { text: promptText },
      {
        body: {
          context: fileSummary,
          lib: lib,
          mode: 'implement',
        },
      }
    );

    setPromptText('');
    derivedState.activeSession?.messages?.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: promptText,
      createdAt: Date.now(),
      context: fileSummary,
      lib,
    });
    chatScrollIntoView();
  };

  // 同步 Valtio store -> useChat state
  useEffect(() => {
    if (simple) {
      return;
    }
    setTimeout(() => {
      const sessionMessages = derivedSnap.activeSession?.messages;
      if (sessionMessages?.length > 0) {
        const converted = convertToUIMessages(sessionMessages);
        // 避免无限循环，仅当消息数量或内容不同时更新
        if (messages.length !== converted.length ||
          JSON.stringify(messages) !== JSON.stringify(converted)) {
          setMessages(converted);
        }
      }
    })
  }, [derivedSnap.activeSession?.id, derivedSnap.activeSession?.messages?.length]);

  // 处理从外部（如demo页）发起的对话
  useEffect(() => {
    if (snap.tempMessage) {
      sendMessage({ text: snap.tempMessage.content });
      derivedState.activeSession?.messages?.push?.(snap.tempMessage);
      AIChatStore.tempMessage = null;
    }
  }, [snap.tempMessage]);

  useEffect(() => {
    chatScrollIntoView();
    if (simple) {
      createPureNewSession(title);
    }
    return () => {
      clearEmptySession();
    };
  }, []);

  useEffect(() => {
    chatScrollIntoView();
  }, [snap.activeSessionId]);

  // 将 messages 数组作为依赖项。当它变化时，Hook 会运行。
  const { containerRef, anchorRef } = useAutoScroll(messages);

  return (
    <>
      <Flex gap="middle" vertical className={styles.chatContainer} ref={containerRef} >
        {messages.map((msg, index) => {
          const textContent = getTextContent(msg);
          return (
            <Bubble
              key={msg.id || index}
              content={<MarkdownComponent content={textContent} showRunButton={!props.simple} />}
              avatar={msg.role === 'assistant' ? avatar : null}
              footer={
                msg.role === 'assistant' &&
                  index > 0 &&
                  index === messages.length - 1 &&
                  status === 'ready' ? (
                  <Space size="small">
                    <Tooltip title={formatMessage({ id: 'ai.msgbox.retry' })}>
                      <Button
                        onClick={() => regenerate()}
                        color="default"
                        variant="text"
                        size="small"
                        icon={<SyncOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title={formatMessage({ id: 'ai.msgbox.copy' })}>
                      <Button
                        color="default"
                        variant="text"
                        size="small"
                        onClick={() => copyToClipboard(textContent)}
                        icon={copyState.value === textContent ? <CheckOutlined /> : <CopyOutlined />}
                      />
                    </Tooltip>
                  </Space>
                ) : null
              }
              placement={msg.role === 'user' ? 'end' : 'start'}
            />
          );
        })}
        {/* 根据 status 状态显示加载中 */}
        {(status === 'streaming' || status === 'submitted') &&
          messages[messages.length - 1]?.role === 'user' && (
            <Bubble placement="start" avatar={avatar} loading />
          )}
        {/* 这是我们的滚动锚点，它永远在列表的末尾 */}
        <div ref={anchorRef} id="msgBoxAnchor"/>
      </Flex>
      <div>
        {!props.simple && (
          <div className={styles.newButtonContainer}>
            <Space>
              <button type="button" onClick={() => history.push('/')} className={styles.newButton}>
              <Space>
                <PlusSquareOutlined />
                {formatMessage({ id: 'ai.msgbox.start.new.chat' })}
              </Space>
            </button>
            {/* {showScrollDownButton && <button type="button" onClick={chatScrollIntoView} className={styles.newButton}>
              <VerticalAlignBottomOutlined />
            </button>} */}
            </Space>
          </div>
        )}
        <PromptTextarea
          size="compact"
          mode="implement"
          value={promptText}
          onChange={setPromptText}
          loading={status === 'streaming' || status === 'submitted'}
          onCancel={stop}
          showAction={!props.simple}
          style={{ marginBottom: 0 }}
          onConfirm={handleSubmit}
          lib={lib}
          onLibChange={setLib}
          onDataSummaryChange={setFileSummary}
        />
      </div>
    </>
  );
}

export default MsgBox;
