import React, {useEffect, useState} from 'react';
import {PromptTextarea} from "../../../../components/AI/HomeDialog/PromptTextarea";
import {Flex, Space} from 'antd';
import { Bubble } from '@ant-design/x';
import { history } from 'dumi';
import {useStreamingText} from "../../../../hooks/useStreamingText";
import {PlusSquareOutlined} from "@ant-design/icons";
import styles from './index.module.less';
import { useSnapshot } from 'valtio';
import { AIChatStore, derivedState } from '../../../../model/AIChat';
import {findLast} from "lodash-es";
import {MarkdownComponent} from "../MarkdownComponent";

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
    backgroundColor: '#fff',
  }};

function MsgBox(props) {
  const [promptText, setPromptText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false); // trigger
  const [loading, setLoading] = useState(false);
  const snap = useSnapshot(AIChatStore);
  const derivedSnap = useSnapshot(derivedState);

  const streamingText = useStreamingText({
    url: 'http://127.0.0.1:7001/ai/chat',
    method: 'POST',
    body: {
      "gptConversationId": derivedSnap.activeSession?.id,
      "query": findLast(derivedSnap.activeSession?.messages, (msg) => msg.role === 'user')?.content
    },
    trigger: isStreaming, // 将 isStreaming 状态作为 trigger
    headers: {
      'Content-Type': 'application/json',
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
      } catch (e) {
        // 说明不是JSON格式
      } finally {
        // 当流结束时，更新最后一条消息并重置 trigger
        setIsStreaming(false); // **关键：流结束后，关闭 trigger**
        setLoading(false);
      }
    },
    onError: (error) => {
      // 处理错误
      console.error("AI stream failed:", error);
      // setMessages(prev => [
      //   ...prev,
      //   { id: Date.now(), role: 'assistant', content: `Sorry, an error occurred: ${error.message}` }
      // ]);
      setIsStreaming(false); // **关键：出错后，也要关闭 trigger**
    }
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
      // mode,
      // lib,
    });
    // **关键：开启 trigger，开始请求**
    setIsStreaming(true);
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
  }, []);


  return <>
    <Flex gap="middle" vertical className={styles.chatContainer}>
      {
        derivedSnap.activeSession?.messages?.map((msg, index) =>
          <Bubble
            key={index}
            content={<MarkdownComponent content={msg.content}/>}
            avatar={msg.role === 'assistant' && avatar}
            placement={msg.role === 'user' ? 'end' : 'start'}/>)
      }
      {
      loading && <Bubble
        placement="start"
        avatar={avatar}
        loading={loading}
      />
      }
      {/*<Bubble*/}
      {/*  placement="start"*/}
      {/*  content={<List style={{width: "200px"}}*/}
      {/*    itemLayout="horizontal"*/}
      {/*                 size="small"*/}
      {/*  >*/}
      {/*    {Object.keys(projectFiles).map((item, index) => <List.Item key={index}>*/}
      {/*        <List.Item.Meta*/}
      {/*          avatar={<CheckOutlined style={{color: '#49de80'}}/>}*/}
      {/*          title={`创建 ${item}`}*/}
      {/*        />*/}
      {/*      </List.Item>)}*/}
      {/*  </List>}*/}
      {/*  avatar={avatar}*/}
      {/*  footer={<Space>*/}
      {/*    <a><LikeOutlined /></a>*/}
      {/*    <a><DislikeOutlined /></a>*/}
      {/*  </Space>}*/}
      {/*/>*/}
    </Flex>
    <div>
      <div className={styles.newButtonContainer}>
        <button type="button" onClick={() => history.push('/')} className={styles.newButton}>
          <Space>
            <PlusSquareOutlined/>
            开始新对话
          </Space>
        </button>
      </div>
      <PromptTextarea size="compact" mode="implement" value={promptText}
                      onChange={setPromptText}
                      style={{marginBottom: 0}} onConfirm={handleSubmit}/>
    </div>
  </>;
}

export default MsgBox;
