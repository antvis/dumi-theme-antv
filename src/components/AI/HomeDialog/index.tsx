import React, {useState} from 'react';
import styles from './index.module.less';
import {AntVBanner} from "./AntVBanner";
import {PromptTextarea} from "./PromptTextarea";
import {RecommendCase} from "./RecommendCase";
import {ModeSelector} from "./ModeSelector";
import { useLocalStorageState } from 'ahooks';
import {AIMode, AIModeType} from "../constant";
import classnames from "classnames";

interface HomeDialogProps {
  lib?: string;
  className?: string;
  style?: React.CSSProperties;
  promptTextareaStyle?: React.CSSProperties;
}

export function HomeDialog(props: HomeDialogProps) {
  const [lib, setLib] = useState(props.lib);
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
        // 发起请求
        // todo  埋点
      }}
      style={props.promptTextareaStyle}
    />
    <RecommendCase/>
  </div>;
}
