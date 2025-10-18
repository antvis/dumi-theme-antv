import React, { useState } from 'react';
import styles from './index.module.less';
import { AntVBanner } from './AntVBanner';
import { PromptTextarea } from './PromptTextarea';
import { RecommendCase } from './RecommendCase';
import { ModeSelector } from './ModeSelector';
import { useLocalStorageState } from 'ahooks';
import { AIMode, AIModeType } from '../constant';
import classnames from 'classnames';
import { history, useSiteData } from 'dumi';
import { AIChatStore } from '../../../model/AIChat';
import {snapshot} from "valtio";

interface HomeDialogProps {
  className?: string;
  style?: React.CSSProperties;
  promptTextareaStyle?: React.CSSProperties;
  recommendCaseClassName?: string;
}

export function HomeDialog(props: HomeDialogProps) {
  const { themeConfig } = useSiteData();
  const [lib, setLib] = useState(!themeConfig.isAntVSite ? themeConfig.title : undefined);
  const [mode, setMode] = useLocalStorageState<AIModeType>(
    'use-local-storage-ai-mode-type',
    {
      defaultValue: AIMode.implement
    }
  );
  const [promptText, setPromptText] = useState<string>('');

  return <div className={classnames(styles.content, props.className)} style={props.style}>
    <AntVBanner/>
    <ModeSelector
      onChange={(v) => {
        setMode(v);
        // todo  埋点
      }}
      value={mode}
    />
    <PromptTextarea
      mode={mode}
      value={promptText}
      lib={lib}
      onLibChange={(v) => {
        setLib(v);
      }}
      onChange={(val) => {
        setPromptText(val);
      }}
      onConfirm={() => {
        // todo  埋点
        // 1. 创建一个新的会话
        const newSessionId = crypto.randomUUID();
        AIChatStore.sessions.unshift({
          id: newSessionId,
          title: promptText.substring(0, 20), // 使用输入内容作为初始标题
          createdAt: Date.now(),
          messages: [],
        });
        AIChatStore.activeSessionId = newSessionId;

        // 2. 创建临时消息并存入 store
        AIChatStore.tempMessage = {
          id: crypto.randomUUID(),
          role: 'user',
          content: promptText,
          createdAt: Date.now(),
          mode,
          lib,
        };
        history.push(`/zh/ai-playground/2`);
      }}
      style={props.promptTextareaStyle}
    />
    <RecommendCase className={props.recommendCaseClassName}/>
  </div>;
}
