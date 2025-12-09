import {
  BranchesOutlined,
  CheckOutlined,
  CopyOutlined, DeleteOutlined,
  PlusSquareOutlined,
  SyncOutlined, ToolOutlined
} from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Flex, Space, Tooltip } from 'antd';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport, type UIMessage } from 'ai';
import {useIntl, useSiteData} from 'dumi';
import { findLast } from 'lodash-es';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useSnapshot } from 'valtio';
import { PromptTextarea } from '../../../../components/AI/HomeDialog/PromptTextarea';
import {
  AIChatStore, branchMessage, clearEmptySession,
  createPureNewSession, deleteMessage,
  derivedState,
} from '../../../../model/AIChat';
import type { Message } from '../../../../types';
import { getCodeFromMarkdown, isPreviewable } from '../../../../utils/code';
import { MarkdownComponent } from '../MarkdownComponent';
import styles from './index.module.less';
import { useAutoScroll } from './useAutoScroll';
import {getBaseURL} from "../../../../utils/env";
import {AIMode} from "../../../../components/AI/constant";
import {trackEvent} from "../../../../utils/analytics";

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
  const { formatMessage } = useIntl();
  const [promptText, setPromptText] = useState<string>('');
  const [fileSummary, setFileSummary] = useState('');
  const snap = useSnapshot(AIChatStore);
  const derivedSnap = useSnapshot(derivedState);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const latestUserMessage = findLast(derivedSnap.activeSession?.messages, (msg) => msg.role === 'user');
  // 使用 ref 存储动态值，避免重新创建 transport
  const anonymousUserIdRef = useRef(snap.anonymousUserId);
  const activeSessionIdRef = useRef(derivedSnap.activeSession?.id);
  const { themeConfig } = useSiteData();

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
        library: AIChatStore.lib,
        mode: AIChatStore.mode,
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
        } else {
          AIChatStore.codeBlock = '';
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
    experimental_throttle: 500
  });

  // 处理用户提交
  const handleSubmit = () => {
    const trimmedPrompt = promptText.trim();
    if (!trimmedPrompt || status === 'streaming' || status === 'submitted') return;
    if (derivedSnap.activeSession && derivedSnap.activeSession.messages?.length === 0) {
      derivedState.activeSession.title = trimmedPrompt;
    }
    // 使用 sendMessage 函数发送新消息
    // 第二个参数传递每次请求特定的额外数据
    sendMessage(
      { text: promptText },
      {
        body: {
          // context: fileSummary,
          // lib: snap.lib,
          // mode: snap.mode,
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
      lib: snap.lib,
    });
    chatScrollIntoView();
    // 埋点
    if (typeof window === 'object') {
      trackEvent('start_ai_chat', {
        entry_point: simple ? 'Drawer' : 'MsgBox',
        mode: AIChatStore.mode,
        lib: AIChatStore.lib,
        page_title: document.title,
        location: location.href
      });
    }
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
      } else {
        setMessages([]);
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
      AIChatStore.mode = AIMode.implement;
      if (!themeConfig.isAntVSite && themeConfig.title) {
        AIChatStore.lib = themeConfig.title;
      }
    }
    return () => {
      if (simple) {
        clearEmptySession();
      }
    }
  }, []);

  useEffect(() => {
    chatScrollIntoView();
    stop();
    AIChatStore.errorMsg = null;
  }, [snap.activeSessionId]);

  // 将 messages 数组作为依赖项。当它变化时，Hook 会运行。
  const { containerRef, anchorRef } = useAutoScroll(messages);

  const autofix = () => {
    const autoFixPromptText = `${formatMessage({ id: 'ai.msgbox.auto.fix.prompt' })} [${snap.errorMsg}]`;
    sendMessage(
      { text: autoFixPromptText },
      {
        body: {
          antvContext: snap.codeBlock
        },
      }
    );
    AIChatStore.errorMsg = null;
    derivedState.activeSession?.messages?.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: autoFixPromptText,
      createdAt: Date.now(),
      context: snap.codeBlock,
      lib: snap.lib,
    });
    chatScrollIntoView();
  }

  return (
    <>
      <Flex gap="middle" vertical className={styles.chatContainer} ref={containerRef}>
        {messages.map((msg, index) => {
          const textContent = getTextContent(msg);
          return (
            <Bubble
              key={msg.id || index}
              content={<MarkdownComponent content={textContent} showRunButton={!props.simple} />}
              avatar={msg.role === 'assistant' ? avatar : null}
              footer={
                status === 'ready' && (
                  <Space size="small">
                    {msg.role === 'assistant' && index === messages.length - 1 && (
                      <Tooltip title={formatMessage({ id: 'ai.msgbox.retry' })}>
                        <Button
                          onClick={() => {
                            regenerate();
                            derivedState.activeSession.messages.pop();
                          }}
                          color="default"
                          variant="text"
                          size="small"
                          icon={<SyncOutlined />}
                        />
                      </Tooltip>
                    )}
                    <Tooltip title={formatMessage({ id: 'ai.msgbox.copy' })}>
                      <Button
                        color="default"
                        variant="text"
                        size="small"
                        onClick={() => copyToClipboard(textContent)}
                        icon={copyState.value === textContent ? <CheckOutlined /> : <CopyOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title={formatMessage({ id: 'ai.msgbox.continue.from.here' })}>
                      <Button
                        color="default"
                        variant="text"
                        size="small"
                        onClick={() => branchMessage(index)}
                        icon={<BranchesOutlined />}
                      />
                    </Tooltip>
                    {msg.role === 'assistant' && (
                      <Tooltip title={formatMessage({ id: 'ai.msgbox.delete' })}>
                        <Button
                          color="default"
                          variant="text"
                          size="small"
                          onClick={() => deleteMessage(msg.id)}
                          icon={<DeleteOutlined />}
                        />
                      </Tooltip>
                    )}
                  </Space>
                )
              }
              placement={msg.role === 'user' ? 'end' : 'start'}
            />
          );
        })}
        {/* 根据 status 状态显示加载中 */}
        {(status === 'streaming' || status === 'submitted') && messages[messages.length - 1]?.role === 'user' && (
          <Bubble placement="start" avatar={avatar} loading />
        )}
        {/* 这是我们的滚动锚点，它永远在列表的末尾 */}
        <div ref={anchorRef} id="msgBoxAnchor" />
      </Flex>
      <div>
        {!props.simple && (
          <div className={styles.newButtonContainer}>
            <Space>
              <button type="button" onClick={() => createPureNewSession()} className={styles.newButton}>
                <Space>
                  <PlusSquareOutlined />
                  {formatMessage({ id: 'ai.msgbox.start.new.chat' })}
                </Space>
              </button>
              {snap.errorMsg && status === 'ready' && (
                <Button onClick={autofix} color="danger" variant="filled" icon={<ToolOutlined />}>
                  {formatMessage({ id: 'ai.msgbox.auto.fix' })}
                </Button>
              )}
            </Space>
          </div>
        )}
        <PromptTextarea
          size="compact"
          value={promptText}
          onChange={setPromptText}
          loading={status === 'streaming' || status === 'submitted'}
          onCancel={stop}
          showAction={!props.simple}
          style={{ marginBottom: 0 }}
          onConfirm={handleSubmit}
          onDataSummaryChange={setFileSummary}
          showModeSelector={true}
        />
      </div>
    </>
  );
}

export default MsgBox;
