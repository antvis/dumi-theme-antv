import React, {useState} from 'react';
import {PromptTextarea} from "../../../../components/AI/HomeDialog/PromptTextarea";
import {Flex, List, Space} from 'antd';
import { Bubble } from '@ant-design/x';
import { history } from 'dumi';
import {useStreamingText} from "../../../../hooks/useStreamingText";
import {PlusSquareOutlined} from "@ant-design/icons";
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
    backgroundColor: '#fff',
  }};

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

function MsgBox(props) {
  const [messages, setMessages] = useState<Message[]>([]); // 存储所有对话历史
  const [input, setInput] = useState(''); // 用户输入框的内容
  const [isStreaming, setIsStreaming] = useState(true); // trigger
  const [loading, setLoading] = useState(true);

  const streamingText = useStreamingText({
    url: 'http://127.0.0.1:7001/links/chat',
    method: 'POST',
    body: {
      "gptConversationId": "huiyuTest",
      "query": "展示过去一周每天的平均温度，周一温度为15°C，周二温度为16°C，周三温度为15.5°C，周四温度为17°C，周五温度为18°C，周六温度为19°C，周日温度为20°C。用面积图可视化",
    },
    trigger: isStreaming, // 将 isStreaming 状态作为 trigger
    headers: {
      'Content-Type': 'application/json',
    },
    onFinish: (finalText) => {
      // 当流结束时，更新最后一条消息并重置 trigger
      setMessages(prev =>
        prev.map(msg =>
          msg.id === Date.now() ? { ...msg, content: finalText } : msg
        )
      );
      setIsStreaming(false); // **关键：流结束后，关闭 trigger**
      setLoading(false);
    },
    onError: (error) => {
      // 处理错误
      console.error("AI stream failed:", error);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), role: 'assistant', content: `Sorry, an error occurred: ${error.message}` }
      ]);
      setIsStreaming(false); // **关键：出错后，也要关闭 trigger**
    }
  });

  // 3. 处理用户提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return; // 如果正在流式输出，则不允许发送

    const userMessage: Message = { id: Date.now(), role: 'user', content: input };
    const assistantPlaceholder: Message = { id: Date.now() + 1, role: 'assistant', content: '' };

    // 将用户消息和AI的占位消息加入列表
    setMessages(prev => [...prev, userMessage, assistantPlaceholder]);
    setInput('');

    // **关键：开启 trigger，开始请求**
    setIsStreaming(true);
  };

  // 找到正在流式输出的消息
  const streamingMessageIndex = messages.findIndex(
    (msg) => msg.role === 'assistant' && msg.content === '' && isStreaming
  );


  return <>
    <Flex gap="middle" vertical>
      <Bubble
        placement="end"
        content="一个城市过去五年来的年度降雨量分别是：2016年800毫米，2017年900毫米，2018年700毫米，2019年1000毫米，2020年1100毫米。使用折线图描绘这些数据。"
        avatar={null}
      />
      <Bubble
        placement="start"
        content={messages[0]?.content}
        avatar={avatar}
        loading={loading}
      />
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
      <PromptTextarea size="compact" mode="implement" value="" style={{marginBottom: 0}}/>
    </div>
  </>;
}

export default MsgBox;
