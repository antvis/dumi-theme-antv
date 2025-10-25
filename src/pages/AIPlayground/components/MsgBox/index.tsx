import {
  CheckOutlined,
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  PlusSquareOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Flex, Space, Tooltip } from 'antd';
import {history, useSiteData} from 'dumi';
import {findLast, isEmpty} from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useSnapshot } from 'valtio';
import { PromptTextarea } from '../../../../components/AI/HomeDialog/PromptTextarea';
import { useStreamingText } from '../../../../hooks/useStreamingText';
import {
  AIChatStore, clearEmptySession,
  createNewSession,
  createPureNewSession,
  derivedState,
  handleDeleteSession
} from '../../../../model/AIChat';
import { Message } from '../../../../types';
import { getCodeFromMarkdown, isPreviewable } from '../../../../utils/code';
import { MarkdownComponent } from '../MarkdownComponent';
import styles from './index.module.less';

const avatar = {
  icon: (
    <img
      draggable={false}
      src={'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original'}
      alt="AntV"
    />
  ),
  style: {
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
};

const chatScrollIntoView = () => {
  setTimeout(() => {
    const nodeList = document.querySelectorAll('.ant-bubble');
    nodeList[nodeList.length - 1].scrollIntoView({ behavior: 'smooth' });
  });
};

interface MsgBoxProps {
  messages?: Message[];
  simple?: boolean;
  context?: string;
  onCodegen?: (code: string) => void;
  title?: string;
}

function MsgBox(props: MsgBoxProps) {
  const {messages = [], simple = false, context = '', onCodegen, title} = props;
  const { themeConfig } = useSiteData();
  const [lib, setLib] = useState(!themeConfig.isAntVSite ? themeConfig.title : undefined);
  const [promptText, setPromptText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false); // trigger
  const [loading, setLoading] = useState(false);
  const snap = useSnapshot(AIChatStore);
  const derivedSnap = useSnapshot(derivedState);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const latestUserMessage = findLast(derivedSnap.activeSession?.messages, (msg) => msg.role === 'user');
  const [fileSummary, setFileSummary] = useState('');
  const streamingText = useStreamingText({
    url: 'https://webgw-pre.alipay.com/visqaservice/external/chat',
    method: 'POST',
    body: {
      gptConversationId: derivedSnap.activeSession?.id,
      query: latestUserMessage?.content,
      library: latestUserMessage?.lib || lib,
      mode: latestUserMessage?.mode,
      anonymousUserId: snap.anonymousUserId,
      context: latestUserMessage?.context || context,
      mountId: "container"
    },
    trigger: isStreaming, // 将 isStreaming 状态作为 trigger
    headers: {
      'Content-Type': 'application/json',
      'x-webgw-version': '2.0',
      'x-webgw-appid': '180020010001210065',
    },
    beforeStart: () => {
      setLoading(true);
    },
    onFinish: (finalText) => {
      try {
        const finalJSON = JSON.parse(finalText);
        derivedState.activeSession?.messages?.push({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: finalJSON.content,
          createdAt: Date.now(),
          // mode,
          // lib,
        });
        if (isPreviewable(finalJSON.content)) {
          const codeBlock = getCodeFromMarkdown(finalJSON.content).code;
          AIChatStore.codeBlock = codeBlock;
          onCodegen?.(codeBlock);
        }
      } catch (e) {
        // 说明不是JSON格式
      } finally {
        // 当流结束时，更新最后一条消息并重置 trigger
        setIsStreaming(false); // **关键：流结束后，关闭 trigger**
        setLoading(false);
        chatScrollIntoView();
      }
    },
    onError: (error) => {
      console.log('回答失败', error);
      // 处理错误
      derivedState.activeSession?.messages?.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `抱歉，我没能成功处理您的请求，请稍后再次提问`,
        createdAt: Date.now(),
        // mode,
        // lib,
      });
      setIsStreaming(false);
      setLoading(false);
    },
  });

  // 3. 处理用户提交
  const handleSubmit = () => {
    if (!promptText.trim() || isStreaming) return; // 如果正在流式输出，则不允许发送
    setPromptText('');
    derivedState.activeSession?.messages?.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: promptText,
      createdAt: Date.now(),
      context: fileSummary,
      lib,
    });
    // **关键：开启 trigger，开始请求**
    setIsStreaming(true);
    chatScrollIntoView();
  };

  useEffect(() => {
    // 检查是否存在临时消息
    if (snap.tempMessage) {
      const activeSession = derivedState.activeSession;
      if (activeSession) {
        // 1. 将临时消息正式添加到当前会话中
        activeSession.messages.push(snap.tempMessage);
        setIsStreaming(true);
        AIChatStore.tempMessage = null;
      }
    }
    if (simple) {
      createPureNewSession(title);
    }

    return () => {
      clearEmptySession();
    };
  }, []);

  useEffect(() => {
    if (derivedState.activeSession && Date.now() - derivedState.activeSession.createdAt > 5000) {
      setLoading(false);
      setIsStreaming(false);
    }
  }, [snap.activeSessionId]);

  const showMessages = [...messages, ...(derivedSnap.activeSession?.messages || [])];

  return (
    <>
      <Flex gap="middle" vertical className={styles.chatContainer}>
        {showMessages?.map((msg, index) => (
          <Bubble
            key={index}
            content={<MarkdownComponent content={msg.content} />}
            avatar={msg.role === 'assistant' ? avatar : null}
            footer={
              (msg.role === 'assistant' && index > 0) ? (
                <Space size="small">
                  <Tooltip title="点赞">
                    <Button color="default" variant="text" size="small" icon={<LikeOutlined />} />
                  </Tooltip>
                  <Tooltip title="点踩">
                    <Button color="default" variant="text" size="small" icon={<DislikeOutlined />} />
                  </Tooltip>
                  {index === showMessages.length - 1 && <Tooltip title="再来一次">
                    <Button onClick={() => {
                      derivedState.activeSession.messages.pop();
                      setIsStreaming(true);
                    }}
                      color="default" variant="text" size="small" icon={<SyncOutlined />} />
                  </Tooltip>}
                  <Tooltip title="复制">
                    <Button
                      color="default"
                      variant="text"
                      size="small"
                      onClick={() => copyToClipboard(msg.content)}
                      icon={copyState.value === msg.content ? <CheckOutlined /> : <CopyOutlined />}
                    />
                  </Tooltip>
                </Space>
              ) : null
            }
            placement={msg.role === 'user' ? 'end' : 'start'}
          />
        ))}
        {loading && <Bubble placement="start" avatar={avatar} loading={loading} />}
      </Flex>
      <div>
        {!props.simple && (
          <div className={styles.newButtonContainer}>
            <button type="button" onClick={() => history.push('/')} className={styles.newButton}>
              <Space>
                <PlusSquareOutlined />
                开始新对话
              </Space>
            </button>
          </div>
        )}
        <PromptTextarea
          size="compact"
          mode="implement"
          value={promptText}
          onChange={setPromptText}
          loading={loading}
          onCancel={() => {
            setIsStreaming(false);
            setLoading(false);
          }}
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
